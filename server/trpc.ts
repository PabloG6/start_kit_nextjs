import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";
import SuperJSON from "superjson";

const t = initTRPC.context<Context>().create({ transformer: SuperJSON });

export const router = t.router;
export const publicProcedure = t.router;
export const middleware = t.middleware;
export const authProcedure = t.procedure.use(
  middleware(async ({ ctx, next }) => {
    if (ctx.session == null) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({ ctx });
  }),
);
