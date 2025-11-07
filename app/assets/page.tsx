import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SearchParams {
  q?: string;
  tag?: string;
  category?: string;
  page?: string;
}

export default async function AssetsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = searchParams.q || "";
  const tag = searchParams.tag;
  const category = searchParams.category;
  const page = parseInt(searchParams.page || "1");
  const pageSize = 12;

  let where: any = { status: "PUBLISHED" };

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  if (tag) {
    where.tags = { contains: tag };
  }

  if (category) {
    where.categories = { contains: category };
  }

  const [assets, total] = await Promise.all([
    prisma.asset.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.asset.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  // Get all unique tags and categories for filters
  const allAssets = await prisma.asset.findMany({
    where: { status: "PUBLISHED" },
    select: { tags: true, categories: true },
  });

  const allTags = new Set<string>();
  const allCategories = new Set<string>();

  allAssets.forEach((a) => {
    parseJson<string[]>(a.tags, []).forEach((tag) => allTags.add(tag));
    parseJson<string[]>(a.categories, []).forEach((cat) => allCategories.add(cat));
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Assets & Scripts</h1>
      <p className="text-gray-600 mb-8">
        Free downloads for Roblox Studio creators
      </p>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <Input
            placeholder="Search assets..."
            defaultValue={query}
            className="max-w-xs"
          />
        </div>

        {Array.from(allTags).length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {Array.from(allTags).map((t) => (
              <Link key={t} href={`/assets?tag=${encodeURIComponent(t)}`}>
                <Badge
                  variant={tag === t ? "default" : "outline"}
                  className="cursor-pointer"
                >
                  {t}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {Array.from(allCategories).length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {Array.from(allCategories).map((c) => (
              <Link
                key={c}
                href={`/assets?category=${encodeURIComponent(c)}`}
              >
                <Badge
                  variant={category === c ? "default" : "secondary"}
                  className="cursor-pointer"
                >
                  {c}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Assets Grid */}
      {assets.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          No assets found. Try adjusting your filters.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {assets.map((asset) => {
              const tags = parseJson<string[]>(asset.tags, []);
              const categories = parseJson<string[]>(asset.categories, []);
              return (
                <Link key={asset.id} href={`/assets/${asset.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">{asset.title}</CardTitle>
                      <CardDescription className="line-clamp-3">
                        {asset.description.slice(0, 150)}...
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">v{asset.version}</Badge>
                        <Badge variant="secondary">{asset.license}</Badge>
                      </div>
                      <div className="flex gap-1 flex-wrap mb-2">
                        {tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">
                        {asset.downloadCount} downloads
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {page > 1 && (
                <Link href={`/assets?page=${page - 1}`}>
                  <Button variant="outline">Previous</Button>
                </Link>
              )}
              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link href={`/assets?page=${page + 1}`}>
                  <Button variant="outline">Next</Button>
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
