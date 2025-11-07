import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
          <p className="text-sm text-slate-600">Access the store admin and manage premium drops.</p>
        </div>
        <LoginForm />
        <p className="text-center text-xs text-slate-500">
          Need access? Contact an administrator to create an account. Self sign-up is disabled.
        </p>
        <p className="text-center text-xs text-slate-500">
          Forgot your credentials? Reach us at{" "}
          <Link
            href="mailto:hello@robloxstudiohub.test"
            className="font-medium text-primary hover:text-primary/80"
          >
            hello@robloxstudiohub.test
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
