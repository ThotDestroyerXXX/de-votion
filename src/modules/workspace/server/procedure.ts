import db from "@/db";
import { invitation, organization, user } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { FORM_SCHEMA } from "../lib/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import z from "zod";

export const workspaceRouter = createTRPCRouter({
  getWorkspace: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    if (!userId) {
      throw new Error("User is not authenticated.");
    }
    const organizations = await auth.api.listOrganizations({
      headers: await headers(),
    });

    return organizations;
  }),

  createWorkspace: protectedProcedure
    .input(
      FORM_SCHEMA.extend({
        image: z.url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      if (!userId) {
        throw new Error("User is not authenticated.");
      }

      const { image, name, description, type } = input;
      console.log(image);
      const data = await auth.api.createOrganization({
        body: {
          name: name, // required
          slug: name, // required
          type,
          description,
          logo: image,
          userId, // server-only
          keepCurrentActiveOrganization: false,
        },
        // This endpoint requires session cookies.
        headers: await headers(),
      });

      if (data) {
        await auth.api.setActiveOrganization({
          headers: await headers(),
          body: {
            organizationId: data.id,
            organizationSlug: data.slug,
          },
        });
      }

      return data;
    }),
  deleteWorkspace: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.userId;
    const activeOrganizationId = ctx.organizationId;
    if (!userId || !activeOrganizationId) {
      throw new Error("User is not authenticated.");
    }

    // Implement the logic to delete the workspace
    await auth.api.deleteOrganization({
      headers: await headers(),
      body: {
        organizationId: activeOrganizationId,
      },
    });
  }),

  getPendingInvite: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    if (!userId) {
      throw new Error("User is not authenticated.");
    }

    if (!ctx.users?.email) {
      return [];
    }

    try {
      const data = await db
        .select({
          invitation,
          userName: user.name,
          organizationName: organization.name,
        })
        .from(invitation)
        .innerJoin(user, eq(invitation.inviterId, user.id))
        .innerJoin(organization, eq(invitation.organizationId, organization.id))
        .where(
          and(
            eq(invitation.email, ctx.users.email),
            eq(invitation.status, "pending")
          )
        )
        .execute();

      return data;
    } catch (error) {
      console.error("Error fetching pending invites:", error);
      return [];
    }
  }),

  getMembers: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    const activeOrganizationId = ctx.organizationId;

    if (!userId) {
      throw new Error("User is not authenticated.");
    }

    if (!activeOrganizationId) {
      // Return empty result if no organization is selected
      return {
        memberList: [],
        memberRole: "",
        pendingMember: [],
      };
    }

    const membersResponse = await auth.api.listMembers({
      headers: await headers(),
      query: {
        organizationId: activeOrganizationId,
        sortBy: "createdAt",
        sortDirection: "desc",
      },
    });

    const member = membersResponse.members.filter(
      (member) => member.userId === userId
    );
    const memberRole = member[0]?.role;

    const pendingMember = await auth.api.listInvitations({
      headers: await headers(),
      query: {
        organizationId: activeOrganizationId,
      },
    });

    return {
      memberList: membersResponse.members,
      memberRole,
      pendingMember: pendingMember.filter(
        (member) => member.status === "pending"
      ),
    };
  }),
});
