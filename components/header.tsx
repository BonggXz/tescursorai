"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">
              Roblox Studio Community
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/store"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Store
            </Link>
            <Link
              href="/assets"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Assets
            </Link>
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                Admin
              </Link>
            )}
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{session.user.email}</span>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </nav>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-4 border-t border-gray-200">
            <Link
              href="/"
              className="block text-sm font-medium text-gray-700 hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/store"
              className="block text-sm font-medium text-gray-700 hover:text-primary"
            >
              Store
            </Link>
            <Link
              href="/assets"
              className="block text-sm font-medium text-gray-700 hover:text-primary"
            >
              Assets
            </Link>
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="block text-sm font-medium text-gray-700 hover:text-primary"
              >
                Admin
              </Link>
            )}
            {session ? (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">{session.user.email}</p>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm" className="w-full">Sign In</Button>
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
