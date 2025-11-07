"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Home, Store, Package, Shield, LogIn } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-neutral-900">Roblox Studio</span>
        </Link>

        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-1 text-neutral-700 hover:text-primary transition-colors">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link href="/store" className="flex items-center space-x-1 text-neutral-700 hover:text-primary transition-colors">
            <Store className="h-4 w-4" />
            <span>Store</span>
          </Link>
          <Link href="/assets" className="flex items-center space-x-1 text-neutral-700 hover:text-primary transition-colors">
            <Package className="h-4 w-4" />
            <span>Assets</span>
          </Link>
          {isAdmin && (
            <Link href="/admin" className="flex items-center space-x-1 text-primary hover:text-primary-hover transition-colors">
              <Shield className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          )}
          {session ? (
            <span className="text-sm text-neutral-600">{session.user?.email}</span>
          ) : (
            <Link href="/login" className="flex items-center space-x-1 btn-primary">
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
