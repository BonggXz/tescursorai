import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";

interface FileRef {
  name: string;
  url: string;
  ext: string;
  size: number;
  sha256: string;
}

export default async function AssetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const asset = await prisma.asset.findUnique({
    where: { slug },
  });

  if (!asset || asset.status !== "PUBLISHED") {
    notFound();
  }

  const tags = parseJson<string[]>(asset.tags, []);
  const categories = parseJson<string[]>(asset.categories, []);
  const files = parseJson<FileRef[]>(asset.files, []);

  // Get related assets
  const relatedAssets = await prisma.asset.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: asset.id },
      OR: [
        { categories: { contains: categories[0] || "" } },
        { tags: { contains: tags[0] || "" } },
      ],
    },
    take: 4,
  });

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{asset.title}</h1>

        <div className="flex gap-2 flex-wrap mb-6">
          <Badge variant="outline">v{asset.version}</Badge>
          <Badge variant="secondary">{asset.license}</Badge>
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
          {categories.map((cat) => (
            <Badge key={cat} variant="outline">
              {cat}
            </Badge>
          ))}
        </div>

        <div className="prose max-w-none mb-8">
          <div className="whitespace-pre-wrap text-gray-700">
            {asset.description}
          </div>
        </div>

        {/* Files */}
        {files.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Download Files</CardTitle>
              <CardDescription>
                {files.length} file{files.length !== 1 ? "s" : ""} available
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} • {file.ext.toUpperCase()}
                    </p>
                  </div>
                  <a href={`/api/assets/${asset.id}/download?file=${idx}`}>
                    <Button>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="text-sm text-gray-500 mb-8">
          <p>Total downloads: {asset.downloadCount}</p>
          <p>Last updated: {new Date(asset.updatedAt).toLocaleDateString()}</p>
        </div>

        {/* Related Assets */}
        {relatedAssets.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedAssets.map((related) => {
                const relatedTags = parseJson<string[]>(related.tags, []);
                return (
                  <Link key={related.id} href={`/assets/${related.slug}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="text-lg">{related.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {related.description.slice(0, 100)}...
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">v{related.version}</Badge>
                          <div className="flex gap-1">
                            {relatedTags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          {related.downloadCount} downloads
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
