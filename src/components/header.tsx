'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Package, Store, FolderOpen, Settings, LogOut } from 'lucide-react'

export function Header() {
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.role === 'ADMIN'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Roblox Studio Community</span>
        </Link>

        <nav className="ml-auto flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/store"
            className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
          >
            <Store className="h-4 w-4" />
            Store
          </Link>
          <Link
            href="/assets"
            className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
          >
            <FolderOpen className="h-4 w-4" />
            Assets
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
            >
              <Settings className="h-4 w-4" />
              Admin
            </Link>
          )}

          {session ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm">
                Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
