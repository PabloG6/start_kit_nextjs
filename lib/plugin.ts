import { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint } from "better-auth/api";

export const EmailAndPasswordPlugin = () => {
  return {
    id: "email-and-password-plugin",
    endpoints: {
      createAccount: createAuthEndpoint(
        "/api/email-and-password/",
        {
          method: "POST",
        },
        async (ctx) => {},
      ),
    },
  } satisfies BetterAuthPlugin;
};
