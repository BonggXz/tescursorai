import { prisma } from "@/lib/prisma";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

async function getAssets(searchParams: { q?: string; tag?: string; category?: string; page?: string }) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = 12;
  const skip = (page - 1) * pageSize;

  const where: any = { status: "PUBLISHED" };

  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q } },
      { description: { contains: searchParams.q } },
    ];
  }

  if (searchParams.tag) {
    where.tags = { contains: searchParams.tag };
  }

  if (searchParams.category) {
    where.categories = { contains: searchParams.category };
  }

  const [assets, total] = await Promise.all([
    prisma.asset.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.asset.count({ where }),
  ]);

  return { assets, total, page, pageSize };
}

export default async function AssetsPage({
  searchParams,
}: {
  searchParams: { q?: string; tag?: string; category?: string; page?: string };
}) {
  const { assets, total, page, pageSize } = await getAssets(searchParams);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <h1 className="mb-8 text-4xl font-bold">Assets & Scripts</h1>

          {/* Filters */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row">
            <Input
              placeholder="Search assets..."
              defaultValue={searchParams.q}
              className="flex-1"
            />
            <select className="h-10 rounded-md border border-neutral-300 px-3">
              <option value="">All Categories</option>
              <option value="UI">UI</option>
              <option value="NPC">NPC</option>
              <option value="Building">Building</option>
              <option value="Combat">Combat</option>
              <option value="Utility">Utility</option>
            </select>
          </div>

          {/* Assets Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset) => {
              const tags = JSON.parse(asset.tags || "[]");
              return (
                <Card key={asset.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{asset.title}</CardTitle>
                    <CardDescription>
                      v{asset.version} • {asset.downloadCount} downloads
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm text-neutral-600 mb-4 line-clamp-2">
                      {asset.description.replace(/<[^>]*>/g, "").substring(0, 100)}...
                    </div>
                    <Button className="w-full" asChild>
                      <Link href={`/assets/${asset.slug}`}>View & Download</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "primary" : "outline"}
                  asChild
                >
                  <Link href={`/assets?page=${p}`}>{p}</Link>
                </Button>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
