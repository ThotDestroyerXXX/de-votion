import db from "@/db";
import { member, organization } from "@/db/schema";
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
    const workspace = db
      .select()
      .from(organization)
      .innerJoin(member, eq(member.organizationId, organization.id))
      .where(
        and(
          eq(organization.id, member.organizationId),
          eq(member.userId, userId)
        )
      )
      .execute();

    return workspace;
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
});
