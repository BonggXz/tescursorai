import { prisma } from "@/lib/prisma";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { parseFileRefs } from "@/lib/file-utils";

async function getAsset(slug: string) {
  const asset = await prisma.asset.findUnique({
    where: { slug, status: "PUBLISHED" },
  });

  if (!asset) {
    return null;
  }

  // Get related assets
  const tags = JSON.parse(asset.tags || "[]");
  const related = await prisma.asset.findMany({
    where: {
      id: { not: asset.id },
      status: "PUBLISHED",
      tags: { contains: tags[0] || "" },
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
  const tags = JSON.parse(asset.tags || "[]");
  const categories = JSON.parse(asset.categories || "[]");
  const files = parseFileRefs(asset.files);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">{asset.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <Badge>v{asset.version}</Badge>
              <span className="text-neutral-600">{asset.downloadCount} downloads</span>
              <Badge variant="outline">{asset.license}</Badge>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="prose mb-8" dangerouslySetInnerHTML={{ __html: asset.description }} />
            
            {/* Download Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Download Files</CardTitle>
                <CardDescription>Click to download individual files</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-neutral-600">
                          {(file.size / 1024).toFixed(2)} KB • {file.ext}
                        </p>
                      </div>
                      <Button asChild>
                        <a href={`/api/assets/${asset.id}/download?file=${i}`}>Download</a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {related.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Related Assets</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {related.map((a) => {
                    const aTags = JSON.parse(a.tags || "[]");
                    return (
                      <Card key={a.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{a.title}</CardTitle>
                          <CardDescription>v{a.version} • {a.downloadCount} downloads</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {aTags.slice(0, 3).map((tag: string) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button className="w-full" variant="outline" asChild>
                            <a href={`/assets/${a.slug}`}>View</a>
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
