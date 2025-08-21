import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TEAMSPACE_SCHEMA } from "../lib/schema";
import db from "@/db";
import { member, note, teamspace } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import { and, eq, inArray, or } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const teamspaceRouter = createTRPCRouter({
  createTeamspace: protectedProcedure
    .input(TEAMSPACE_SCHEMA)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      if (!userId) {
        throw new Error("User is not authenticated.");
      }
      const { name, permission, organization_id } = input;
      const membersResponse = await auth.api.listMembers({
        headers: await headers(),
        query: {
          organizationId: organization_id,
          sortBy: "createdAt",
          sortDirection: "desc",
          filterField: "userId",
          filterOperator: "eq",
          filterValue: userId,
        },
      });
      const memberRole = membersResponse.members[0].role;

      if (memberRole !== "admin" && memberRole !== "owner") {
        throw new Error("User is not authorized to create a teamspace.");
      }

      const response = db
        .insert(teamspace)
        .values({
          name,
          permission,
          organizationId: organization_id,
          id: uuidv4(),
        })
        .execute();
      return response;
    }),

  getTeamspaces: protectedProcedure
    .input(
      z.object({
        organization_id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.userId;
      if (!userId) {
        throw new Error("User is not authenticated.");
      }
      const { organization_id } = input;
      const teamspaces = await db
        .select()
        .from(teamspace)
        .innerJoin(member, eq(member.organizationId, teamspace.organizationId))
        .where(
          and(
            eq(teamspace.organizationId, organization_id),
            eq(member.userId, userId),
            // Show teamspaces that are public or default OR
            // Show teamspaces that are private but the user is an owner or admin
            or(
              // Condition 1: permission is default or public
              or(
                eq(teamspace.permission, "default"),
                eq(teamspace.permission, "public")
              ),
              // Condition 2: permission is private but the user has owner or admin role
              and(
                eq(teamspace.permission, "private"),
                or(eq(member.role, "owner"), eq(member.role, "admin"))
              )
            )
          )
        )
        .execute();
      // If no teamspaces, return early
      if (teamspaces.length === 0) {
        return [];
      }

      // Collect teamspace ids
      const teamspaceIds = Array.from(
        new Set(teamspaces.map((row) => row.teamspace.id))
      );

      // Fetch notes belonging to these teamspaces
      const notes = await db
        .select()
        .from(note)
        .where(inArray(note.teamspaceId, teamspaceIds))
        .execute();

      // Group notes by teamspaceId
      const notesByTeamspace: Record<string, typeof notes> = {};
      for (const n of notes) {
        const key = n.teamspaceId;
        if (!notesByTeamspace[key]) notesByTeamspace[key] = [];
        notesByTeamspace[key].push(n);
      }

      // Attach notes to each teamspace row while preserving existing shape
      const result = teamspaces.map((row) => ({
        ...row,
        notes: notesByTeamspace[row.teamspace.id] ?? [],
      }));

      return result;
    }),
});
