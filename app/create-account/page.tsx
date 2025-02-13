"use client";
import { AuthForm } from "@/components/login-form";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthForm
          authType="signup"
          submit={async (data) => {
            await signUp.email({
              fetchOptions: {
                onError: () => {},
                onSuccess: () => {
                  router.push("/dashboard");
                },
              },
              email: data.email,
              password: data.password,
              name: "",
            });
          }}
        />
      </div>
    </div>
  );
}
