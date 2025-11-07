import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { parseJson } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function AdminAssetsPage() {
  await requireAdmin();

  const assets = await prisma.asset.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Assets</h1>
        <Link href="/admin/assets/new">
          <Button>New Asset</Button>
        </Link>
      </div>

      {assets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No assets yet. Create your first asset!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {assets.map((asset) => {
            const tags = parseJson<string[]>(asset.tags, []);
            return (
              <Card key={asset.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{asset.title}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        v{asset.version} • Slug: {asset.slug} •{" "}
                        {asset.downloadCount} downloads
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant={
                          asset.status === "PUBLISHED"
                            ? "default"
                            : asset.status === "DRAFT"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {asset.status}
                      </Badge>
                      <Link href={`/admin/assets/${asset.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {asset.description}
                  </p>
                  {tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {tags.slice(0, 5).map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
