import { workspaceRouter } from "@/modules/workspace/server/procedure";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  workspace: workspaceRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
