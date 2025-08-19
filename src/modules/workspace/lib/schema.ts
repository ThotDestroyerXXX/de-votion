import { workspaceType } from "@/db/schema";
import z from "zod";
import { ACCEPTED_IMAGE_MIME_TYPES, MAX_FILE_SIZE } from "../constants";

export const FORM_SCHEMA = z.object({
  type: z.enum(workspaceType.enumValues),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
  image: z
    .instanceof(File)
    .check(
      z.property(
        "size",
        z
          .number()
          .min(0)
          .max(MAX_FILE_SIZE, `File size should not exceed ${MAX_FILE_SIZE} MB`)
      )
    )
    .refine((file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file.type), {
      message: "Invalid image file type",
    }),
});

export type FormValues = z.infer<typeof FORM_SCHEMA>;
