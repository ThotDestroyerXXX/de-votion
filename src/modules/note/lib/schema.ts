import { teamspacePermission } from "@/db/schema";
import z from "zod";

export const NOTE_SCHEMA = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(100, {
      message: "Name must be at most 100 characters long",
    }),
  permission: z.enum(teamspacePermission.enumValues),
  organization_id: z.string(),
});

export type NoteValues = z.infer<typeof NOTE_SCHEMA>;

export const NOTE_DETAIL_SCHEMA = z.object({
  noteId: z.string(),
  title: z.string().min(1).max(255),
  content: z.string(),
});

export type NoteDetailValues = z.infer<typeof NOTE_DETAIL_SCHEMA>;
