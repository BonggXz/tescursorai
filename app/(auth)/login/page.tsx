import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Access the Roblox Studio community admin tools.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-12">
      <div
        className={cn(
          "card w-full max-w-md bg-white shadow-xl",
          "border border-slate-200/70",
        )}
      >
        <div className="space-y-6 p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Roblox Studio Community
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Admin access only. Contact the community lead to request access.
      </p>
    </div>
  );
}
