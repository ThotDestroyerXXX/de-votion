import { workspaceRouter } from "@/modules/workspace/server/procedure";
import { createTRPCRouter } from "../init";
import { teamspaceRouter } from "@/modules/teamspace/server/procedure";
import { noteRouter } from "@/modules/note/server/procedure";

export const appRouter = createTRPCRouter({
  workspace: workspaceRouter,
  teamspace: teamspaceRouter,
  note: noteRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
