import { teamspacePermission } from "@/db/schema";
import z from "zod";

export const TEAMSPACE_SCHEMA = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(100, {
      message: "Name must be at most 100 characters long",
    }),
  permission: z.enum(teamspacePermission.enumValues),
  organization_id: z.string(),
});

export type TeamspaceValues = z.infer<typeof TEAMSPACE_SCHEMA>;
