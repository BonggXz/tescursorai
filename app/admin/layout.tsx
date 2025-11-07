import { requireAdmin } from "@/lib/auth";
import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-8 border-b border-gray-200">
        <div className="flex gap-4">
          <Link href="/admin">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/admin/products">
            <Button variant="ghost">Products</Button>
          </Link>
          <Link href="/admin/assets">
            <Button variant="ghost">Assets</Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="ghost">Settings</Button>
          </Link>
          <Link href="/admin/users">
            <Button variant="ghost">Users</Button>
          </Link>
          <Link href="/admin/audit">
            <Button variant="ghost">Audit Log</Button>
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
}
