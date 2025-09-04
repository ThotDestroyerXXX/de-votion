import db from "@/db";
import { member, note, noteDetail, organization, teamspace } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { v4 as uuidv4 } from "uuid";

export const noteRouter = createTRPCRouter({
  createNote: protectedProcedure
    .input(
      z.object({
        teamspaceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const activeOrganizationId = ctx.organizationId;
      if (!userId || !activeOrganizationId) {
        throw new Error("User is not authenticated.");
      }

      const { teamspaceId } = input;

      // Check if the user is a member of the teamspace
      const isMember = await db
        .select()
        .from(member)
        .innerJoin(organization, eq(member.organizationId, organization.id))
        .innerJoin(teamspace, eq(teamspace.organizationId, organization.id))
        .where(
          and(
            eq(member.userId, userId),
            eq(teamspace.id, teamspaceId),
            eq(member.organizationId, activeOrganizationId)
          )
        )
        .execute();

      if (!isMember) {
        throw new Error("User Unauthorized");
      }

      const noteId = uuidv4();
      await db
        .insert(note)
        .values({
          id: noteId,
          teamspaceId,
          title: "Untitled",
        })
        .execute();

      return { id: noteId, title: "Untitled", teamspaceId, userId };
    }),

  deleteNote: protectedProcedure
    .input(
      z.object({
        noteId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const activeOrganizationId = ctx.organizationId;
      if (!userId || !activeOrganizationId) {
        throw new Error("User is not authenticated.");
      }

      const { noteId } = input;

      // Check if the user is the owner of the note
      const users = await db
        .select({
          memberRole: member.role,
          teamspacePermission: teamspace.permission,
        })
        .from(note)
        .innerJoin(teamspace, eq(note.teamspaceId, teamspace.id))
        .innerJoin(organization, eq(teamspace.organizationId, organization.id))
        .innerJoin(member, eq(member.organizationId, organization.id))
        .where(
          and(
            eq(note.id, noteId),
            eq(organization.id, activeOrganizationId),
            eq(member.userId, userId)
          )
        )
        .execute();

      const user = users[0];

      if (
        !user ||
        (user.memberRole !== "admin" &&
          user.memberRole !== "owner" &&
          (user.teamspacePermission === "private" ||
            user.teamspacePermission === "default"))
      ) {
        throw new Error("User Unauthorized");
      }

      await db.delete(note).where(eq(note.id, noteId)).execute();

      return { success: true };
    }),

  duplicateNote: protectedProcedure
    .input(
      z.object({
        noteId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const activeOrganizationId = ctx.organizationId;
      if (!userId || !activeOrganizationId) {
        throw new Error("User is not authenticated.");
      }

      const { noteId } = input;

      // Check if the user is the owner of the note
      const users = await db
        .select({
          memberRole: member.role,
          teamspacePermission: teamspace.permission,
          note: note,
        })
        .from(note)
        .innerJoin(teamspace, eq(note.teamspaceId, teamspace.id))
        .innerJoin(organization, eq(teamspace.organizationId, organization.id))
        .innerJoin(member, eq(member.organizationId, organization.id))
        .where(
          and(
            eq(note.id, noteId),
            eq(organization.id, activeOrganizationId),
            eq(member.userId, userId)
          )
        )
        .execute();

      const user = users[0];

      if (
        !user ||
        (user.memberRole !== "admin" &&
          user.memberRole !== "owner" &&
          (user.teamspacePermission === "private" ||
            user.teamspacePermission === "default"))
      ) {
        throw new Error("User Unauthorized");
      }

      const noteDetails = await db
        .select()
        .from(noteDetail)
        .where(eq(noteDetail.noteId, noteId))
        .execute();

      const newNoteId = uuidv4();
      await db
        .insert(note)
        .values({
          id: newNoteId,
          teamspaceId: user.note.teamspaceId,
          title: user.note.title,
        })
        .execute();

      noteDetails.forEach(async (element) => {
        await db
          .insert(noteDetail)
          .values({
            id: uuidv4(),
            noteId: newNoteId,
            content: element.content,
            type: element.type,
            order: element.order,
          })
          .execute();
      });

      return {
        id: newNoteId,
        title: user.note.title,
        teamspaceId: user.note.teamspaceId,
        userId,
      };
    }),
});
