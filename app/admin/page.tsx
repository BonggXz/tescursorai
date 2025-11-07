import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getDashboardStats() {
  const [products, assets, downloads, recentDownloads] = await Promise.all([
    prisma.product.count(),
    prisma.asset.count(),
    prisma.download.count(),
    prisma.download.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  return { products, assets, downloads, recentDownloads };
}

export default async function AdminDashboard() {
  await requireAdmin();
  const stats = await getDashboardStats();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <h1 className="mb-8 text-4xl font-bold">Admin Dashboard</h1>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.products}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.assets}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.downloads}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Last 7 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.recentDownloads}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>Manage store products</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/products">Manage Products</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Assets</CardTitle>
                <CardDescription>Manage free assets</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/assets">Manage Assets</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Site and social settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/settings">Manage Settings</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/users">Manage Users</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
                <CardDescription>View activity logs</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/audit">View Audit Log</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
