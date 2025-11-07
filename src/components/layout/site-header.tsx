import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AppSession } from "@/lib/auth";

type SiteHeaderProps = {
  user: AppSession["user"] | null;
  siteName?: string;
  discordUrl?: string;
};

const navigation = [
  { name: "Home", href: "/" },
  { name: "Store", href: "/store" },
  { name: "Assets", href: "/assets" },
];

export function SiteHeader({
  user,
  siteName = "Roblox Studio Community",
  discordUrl,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/70 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-slate-900">{siteName}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-slate-900">
              {item.name}
            </Link>
          ))}
          {user?.role === "ADMIN" ? (
            <Link href="/admin" className="transition hover:text-slate-900">
              Admin
            </Link>
          ) : null}
        </nav>
        <div className="flex items-center gap-3">
          {discordUrl ? (
            <Button asChild className="hidden md:inline-flex">
              <Link href={discordUrl} target="_blank" rel="noopener noreferrer">
                Join our Discord
              </Link>
            </Button>
          ) : null}
          <Button variant="ghost" asChild className="md:hidden">
            <Link href={discordUrl ?? "/store"}>{discordUrl ? "Discord" : "Store"}</Link>
          </Button>
          {user ? (
            <Link
              href="/api/auth/signout"
              className={cn(
                "rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100",
              )}
            >
              Sign out
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
