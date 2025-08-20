import { workspaceRouter } from "@/modules/workspace/server/procedure";
import { createTRPCRouter } from "../init";
import { teamspaceRouter } from "@/modules/teamspace/server/procedure";

export const appRouter = createTRPCRouter({
  workspace: workspaceRouter,
  teamspace: teamspaceRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
