import { baseProcedure, createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  test: baseProcedure.query(() => {
    return "Hello World";
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
