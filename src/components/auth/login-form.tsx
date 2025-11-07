"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/lib/validation/auth";

export function LoginForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();

  const callbackUrl = searchParams?.get("callbackUrl") ?? "/admin";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const formData = new FormData(event.currentTarget);
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const parsed = loginSchema.safeParse(rawData);

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Invalid credentials.");
      return;
    }

    startTransition(async () => {
      const result = await signIn("credentials", {
        ...parsed.data,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setFormError("Invalid email or password.");
        return;
      }

      router.push(result?.url ?? callbackUrl);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@site.test"
          required
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          disabled={isPending}
        />
      </div>
      {formError ? <p className="text-sm font-medium text-red-500">{formError}</p> : null}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}

export default LoginForm;
