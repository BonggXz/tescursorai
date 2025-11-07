"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">Roblox Studio</span>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium text-neutral-700 hover:text-neutral-900">
            Home
          </Link>
          <Link href="/store" className="text-sm font-medium text-neutral-700 hover:text-neutral-900">
            Store
          </Link>
          <Link href="/assets" className="text-sm font-medium text-neutral-700 hover:text-neutral-900">
            Assets
          </Link>
          {isAdmin && (
            <Link href="/admin" className="text-sm font-medium text-neutral-700 hover:text-neutral-900">
              Admin
            </Link>
          )}
          {session ? (
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin">Dashboard</Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
