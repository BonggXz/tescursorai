import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
  await requireAdmin();

  const [productCount, assetCount, downloadCount, recentDownloads] =
    await Promise.all([
      prisma.product.count(),
      prisma.asset.count(),
      prisma.download.count(),
      prisma.download.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { email: true } } },
      }),
    ]);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentDownloadCount = await prisma.download.count({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{productCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{assetCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{downloadCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{recentDownloadCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/admin/products/new">
          <Button className="w-full">New Product</Button>
        </Link>
        <Link href="/admin/assets/new">
          <Button className="w-full">New Asset</Button>
        </Link>
        <Link href="/admin/settings">
          <Button className="w-full" variant="outline">
            Site Settings
          </Button>
        </Link>
        <Link href="/admin/users">
          <Button className="w-full" variant="outline">
            Manage Users
          </Button>
        </Link>
      </div>

      {/* Recent Downloads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Downloads</CardTitle>
          <CardDescription>Last 10 download events</CardDescription>
        </CardHeader>
        <CardContent>
          {recentDownloads.length === 0 ? (
            <p className="text-gray-500">No downloads yet</p>
          ) : (
            <div className="space-y-2">
              {recentDownloads.map((download) => (
                <div
                  key={download.id}
                  className="flex items-center justify-between p-2 border-b border-gray-200"
                >
                  <div>
                    <p className="font-medium">Asset ID: {download.assetId}</p>
                    <p className="text-sm text-gray-500">
                      {download.user?.email || "Anonymous"} •{" "}
                      {new Date(download.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
