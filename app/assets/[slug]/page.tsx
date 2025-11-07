import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Download, Code } from "lucide-react";
import { notFound } from "next/navigation";
import { DownloadButton } from "@/components/DownloadButton";

async function getAsset(slug: string) {
  const asset = await prisma.asset.findUnique({
    where: { slug, status: "PUBLISHED" },
  });

  if (!asset) {
    return null;
  }

  // Get related assets
  const categories = JSON.parse(asset.categories || "[]");
  const related = await prisma.asset.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: asset.id },
      categories: {
        contains: categories[0] || "",
      },
    },
    take: 4,
  });

  return { asset, related };
}

export default async function AssetPage({ params }: { params: { slug: string } }) {
  const result = await getAsset(params.slug);

  if (!result) {
    notFound();
  }

  const { asset, related } = result;
  const files = JSON.parse(asset.files || "[]");
  const tags = JSON.parse(asset.tags || "[]");
  const categories = JSON.parse(asset.categories || "[]");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Link
          href="/assets"
          className="inline-flex items-center space-x-2 text-neutral-600 hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Assets</span>
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-neutral-900">{asset.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((cat: string) => (
                <Badge key={cat} variant="default">
                  {cat}
                </Badge>
              ))}
              {tags.map((tag: string) => (
                <Badge key={tag} variant="primary">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-neutral-500 mb-6">
              <span>Version: {asset.version}</span>
              <span className="flex items-center space-x-1">
                <Download className="h-4 w-4" />
                <span>{asset.downloadCount} downloads</span>
              </span>
              <Badge variant="default">{asset.license}</Badge>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <div className="whitespace-pre-wrap text-neutral-600">{asset.description}</div>
          </div>

          {/* Files */}
          {files.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-neutral-900">Files</h2>
              <div className="space-y-2">
                {files.map((file: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Code className="h-5 w-5 text-neutral-400" />
                      <div>
                        <p className="font-medium text-neutral-900">{file.name}</p>
                        <p className="text-sm text-neutral-500">
                          {(file.size / 1024).toFixed(2)} KB • {file.ext}
                        </p>
                      </div>
                    </div>
                    <DownloadButton assetId={asset.id} fileUrl={file.url} fileName={file.name} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Assets */}
          {related.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 text-neutral-900">Related Assets</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {related.map((relatedAsset) => {
                  const relatedTags = JSON.parse(relatedAsset.tags || "[]");
                  return (
                    <Link key={relatedAsset.id} href={`/assets/${relatedAsset.slug}`}>
                      <div className="card h-full">
                        <div className="p-6">
                          <h3 className="font-semibold text-neutral-900 mb-2">{relatedAsset.title}</h3>
                          <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
                            {relatedAsset.description.substring(0, 100)}...
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {relatedTags.slice(0, 2).map((tag: string) => (
                              <Badge key={tag} variant="default">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
