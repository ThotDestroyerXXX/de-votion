import db from "@/db";
import { member, note, organization, teamspace } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { v4 as uuidv4 } from "uuid";
import { NOTE_DETAIL_SCHEMA } from "../lib/schema";

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

      const newNoteId = uuidv4();
      await db
        .insert(note)
        .values({
          id: newNoteId,
          teamspaceId: user.note.teamspaceId,
          title: user.note.title,
          content: user.note.content,
        })
        .execute();

      return {
        id: newNoteId,
        title: user.note.title,
        content: user.note.content,
        teamspaceId: user.note.teamspaceId,
        userId,
      };
    }),

  saveNoteContent: protectedProcedure
    .input(
      z.object({
        ...NOTE_DETAIL_SCHEMA.shape,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const activeOrganizationId = ctx.organizationId;
      if (!userId || !activeOrganizationId) {
        throw new Error("User is not authenticated.");
      }

      const { noteId, content, title } = input;

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
      await db
        .update(note)
        .set({
          title,
          content,
        })
        .where(eq(note.id, noteId))
        .execute();

      return {
        id: noteId,
        content,
      };
    }),

  getNote: protectedProcedure
    .input(
      z.object({
        noteId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
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
          user.teamspacePermission === "private")
      ) {
        throw new Error("User Unauthorized");
      }
      const notes = await db
        .select({
          note: note,
        })
        .from(note)
        .where(eq(note.id, noteId))
        .execute();

      if (notes.length === 0) {
        throw new Error("Note not found");
      }

      const editable = !(
        user.memberRole !== "admin" &&
        user.memberRole !== "owner" &&
        (user.teamspacePermission === "private" ||
          user.teamspacePermission === "default")
      );

      return { ...notes[0], editable };
    }),
});
