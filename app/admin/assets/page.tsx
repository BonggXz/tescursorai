import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

async function getAssets() {
  return await prisma.asset.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminAssetsPage() {
  await requireAdmin();
  const assets = await getAssets();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-4xl font-bold">Assets</h1>
            <Button asChild>
              <Link href="/admin/assets/new">Add Asset</Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Title</th>
                      <th className="text-left p-2">Version</th>
                      <th className="text-left p-2">Downloads</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset) => (
                      <tr key={asset.id} className="border-b">
                        <td className="p-2">{asset.title}</td>
                        <td className="p-2">{asset.version}</td>
                        <td className="p-2">{asset.downloadCount}</td>
                        <td className="p-2">
                          <Badge variant={asset.status === "PUBLISHED" ? "default" : "secondary"}>
                            {asset.status}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/assets/${asset.id}`}>Edit</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
