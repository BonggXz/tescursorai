import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { Providers } from '../providers'
import { LayoutDashboard, Package, FolderOpen, Settings, Users, FileText, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    redirect('/login')
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/assets', label: 'Assets', icon: FolderOpen },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/audit', label: 'Audit Log', icon: FileText },
  ]

  return (
    <Providers>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-slate-50 p-6">
          <Link href="/admin" className="flex items-center gap-2 mb-8">
            <Package className="h-6 w-6 text-primary" />
            <span className="font-bold">Admin Panel</span>
          </Link>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white hover:text-primary"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t">
            <Link href="/">
              <Button variant="outline" size="sm" className="w-full">
                ← Back to Site
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="border-b bg-white px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <div className="text-sm text-muted-foreground">
                {session.user?.email}
              </div>
            </div>
          </div>
          <div className="p-8">{children}</div>
        </main>
      </div>
    </Providers>
  )
}
