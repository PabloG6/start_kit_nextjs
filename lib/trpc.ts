import { AppRouter } from "@/server/router";
import { createTRPCContext } from "@trpc/tanstack-react-query";
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
