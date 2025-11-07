import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { parseJsonField, formatDate } from '@/lib/utils'
import { Download, FileCode, Tag, Calendar, Scale } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

async function getAsset(slug: string) {
  const asset = await prisma.asset.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: { files: true },
  })

  if (!asset) return null

  // Get related assets
  const tags = parseJsonField<string[]>(asset.tags, [])
  const related = await prisma.asset.findMany({
    where: {
      status: 'PUBLISHED',
      id: { not: asset.id },
      OR: tags.length > 0 ? [{ tags: { contains: tags[0] } }] : undefined,
    },
    take: 3,
  })

  return { asset, related }
}

export default async function AssetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getAsset(slug)

  if (!data) {
    notFound()
  }

  const { asset, related } = data
  const tags = parseJsonField<string[]>(asset.tags, [])
  const categories = parseJsonField<string[]>(asset.categories, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Asset Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="h-80 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mb-4 flex items-center justify-center">
              <FileCode className="h-32 w-32 text-green-600" />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <Badge variant="outline">{asset.version}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">License</span>
                  <Badge variant="secondary">{asset.license}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Downloads</span>
                  <span className="font-semibold">{asset.downloadCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Published</span>
                  <span>{formatDate(asset.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Asset Details */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.map((cat) => (
                <Badge key={cat} variant="outline">
                  {cat}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl font-bold mb-4">{asset.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(asset.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                {asset.downloadCount} downloads
              </span>
            </div>
          </div>

          {/* Description */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-blue max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{asset.description}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Files */}
          {asset.files.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {asset.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <FileCode className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <a href={`/api/assets/${asset.id}/download?fileId=${file.id}`}>
                        <Button size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags & License */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Tag className="h-4 w-4" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Scale className="h-4 w-4" />
                  License
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This asset is licensed under <strong>{asset.license}</strong>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Related Assets */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((item) => {
              const itemTags = parseJsonField<string[]>(item.tags, [])
              return (
                <a key={item.id} href={`/assets/${item.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-md mb-4 flex items-center justify-center">
                        <FileCode className="h-12 w-12 text-green-600" />
                      </div>
                      <CardTitle className="text-sm line-clamp-2">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {itemTags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {item.downloadCount} downloads
                      </p>
                    </CardContent>
                  </Card>
                </a>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
