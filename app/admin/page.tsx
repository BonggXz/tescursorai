import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Package, Store, Download, Users } from "lucide-react";
import Link from "next/link";

async function getDashboardStats() {
  const [totalProducts, totalAssets, totalDownloads, totalUsers] = await Promise.all([
    prisma.product.count(),
    prisma.asset.count(),
    prisma.download.count(),
    prisma.user.count(),
  ]);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentDownloads = await prisma.download.count({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
  });

  return {
    totalProducts,
    totalAssets,
    totalDownloads,
    totalUsers,
    recentDownloads,
  };
}

export default async function AdminDashboard() {
  await requireAdmin();
  const stats = await getDashboardStats();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-neutral-900">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-neutral-900">{stats.totalProducts}</p>
              </div>
              <Store className="h-8 w-8 text-primary" />
            </div>
            <Link href="/admin/products" className="text-sm text-primary hover:underline mt-2 inline-block">
              Manage →
            </Link>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Assets</p>
                <p className="text-3xl font-bold text-neutral-900">{stats.totalAssets}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
            <Link href="/admin/assets" className="text-sm text-primary hover:underline mt-2 inline-block">
              Manage →
            </Link>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Downloads</p>
                <p className="text-3xl font-bold text-neutral-900">{stats.totalDownloads}</p>
                <p className="text-xs text-neutral-500 mt-1">{stats.recentDownloads} in last 7 days</p>
              </div>
              <Download className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-neutral-900">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
            <Link href="/admin/users" className="text-sm text-primary hover:underline mt-2 inline-block">
              Manage →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4 text-neutral-900">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/admin/products/new" className="block btn-primary text-center">
                Create Product
              </Link>
              <Link href="/admin/assets/new" className="block btn-secondary text-center">
                Create Asset
              </Link>
              <Link href="/admin/settings" className="block btn-secondary text-center">
                Site Settings
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4 text-neutral-900">Navigation</h2>
            <nav className="space-y-2">
              <Link href="/admin/products" className="block text-neutral-700 hover:text-primary">
                Products Management
              </Link>
              <Link href="/admin/assets" className="block text-neutral-700 hover:text-primary">
                Assets Management
              </Link>
              <Link href="/admin/settings" className="block text-neutral-700 hover:text-primary">
                Site Settings
              </Link>
              <Link href="/admin/users" className="block text-neutral-700 hover:text-primary">
                User Management
              </Link>
              <Link href="/admin/audit" className="block text-neutral-700 hover:text-primary">
                Audit Log
              </Link>
            </nav>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
