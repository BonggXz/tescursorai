import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/db'
import { formatBytes } from '@/lib/utils'
import { Providers } from '@/app/providers'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Download, ArrowLeft, FileCode } from 'lucide-react'

async function getAsset(slug: string) {
  const asset = await prisma.asset.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: { files: true },
  })

  if (!asset) return null
  return asset
}

async function getRelatedAssets(assetId: string, tags: string[]) {
  const assets = await prisma.asset.findMany({
    where: {
      id: { not: assetId },
      status: 'PUBLISHED',
      tags: { contains: tags[0] || '' },
    },
    take: 3,
  })

  return assets
}

export default async function AssetPage({
  params,
}: {
  params: { slug: string }
}) {
  const asset = await getAsset(params.slug)

  if (!asset) {
    notFound()
  }

  const tags = JSON.parse(asset.tags || '[]')
  const categories = JSON.parse(asset.categories || '[]')
  const relatedAssets = await getRelatedAssets(asset.id, tags)

  return (
    <Providers>
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 py-12">
          <div className="container">
            <Link href="/assets" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="h-4 w-4" />
              Back to Assets
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-4xl font-bold">{asset.title}</h1>
                  <Badge variant="outline" className="text-sm">
                    v{asset.version}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map((cat: string) => (
                    <Badge key={cat} variant="secondary">
                      {cat}
                    </Badge>
                  ))}
                  {tags.map((tag: string) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    {asset.downloadCount} downloads
                  </div>
                  <div>License: {asset.license}</div>
                </div>

                {/* Description */}
                <div className="prose max-w-none">
                  <MDXRemote source={asset.description} />
                </div>
              </div>

              {/* Sidebar */}
              <div>
                <Card className="sticky top-24">
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <h3 className="font-semibold mb-3">Download Files</h3>
                      <div className="space-y-2">
                        {asset.files.map((file) => (
                          <div
                            key={file.id}
                            className="p-3 bg-slate-50 rounded-lg flex items-start justify-between"
                          >
                            <div className="flex items-start gap-2 flex-1 min-w-0">
                              <FileCode className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatBytes(file.size)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link href={`/api/assets/${asset.id}/download`}>
                      <Button size="lg" className="w-full gap-2">
                        <Download className="h-5 w-5" />
                        Download All
                      </Button>
                    </Link>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Free to download and use
                    </p>

                    <div className="mt-6 pt-6 border-t space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Version</span>
                        <span className="font-medium">{asset.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">License</span>
                        <span className="font-medium">{asset.license}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Files</span>
                        <span className="font-medium">{asset.files.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Related Assets */}
            {relatedAssets.length > 0 && (
              <div className="mt-20">
                <h2 className="text-2xl font-bold mb-6">Related Assets</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedAssets.map((related) => {
                    const relatedTags = JSON.parse(related.tags || '[]')
                    return (
                      <Link key={related.id} href={`/assets/${related.slug}`}>
                        <Card className="h-full hover:shadow-lg transition-shadow">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-2">
                              <CardTitle className="text-base line-clamp-2 flex-1">
                                {related.title}
                              </CardTitle>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {related.version}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {relatedTags.slice(0, 2).map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Download className="h-3 w-3" />
                              {related.downloadCount}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </Providers>
  )
}
