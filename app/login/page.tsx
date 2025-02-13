"use client";
import { AuthForm } from "@/components/login-form";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthForm
          authType="login"
          submit={async (creds) => {
            await signIn.email({
              email: creds.email,
              password: creds.password,
              callbackURL: "/dashboard",
              fetchOptions: {
                onSuccess() {
                  router.push("/dashboard");
                },
              },
            });
          }}
        />
      </div>
    </div>
  );
}
