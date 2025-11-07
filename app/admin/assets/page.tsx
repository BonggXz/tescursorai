import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/prisma'
import { parseJsonField, formatDate } from '@/lib/utils'
import { Plus, Edit, Trash2 } from 'lucide-react'

async function getAssets() {
  return await prisma.asset.findMany({
    orderBy: { createdAt: 'desc' },
    include: { files: true },
  })
}

export default async function AdminAssetsPage() {
  const assets = await getAssets()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Assets</h1>
          <p className="text-muted-foreground">Manage your free assets and scripts</p>
        </div>
        <Link href="/admin/assets/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Asset
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Assets ({assets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assets.map((asset) => {
              const tags = parseJsonField<string[]>(asset.tags, [])
              return (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{asset.title}</h3>
                      <Badge variant={asset.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                        {asset.status}
                      </Badge>
                      <Badge variant="outline">v{asset.version}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{asset.downloadCount} downloads</span>
                      <span>•</span>
                      <span>{asset.files.length} files</span>
                      <span>•</span>
                      <span>{formatDate(asset.createdAt)}</span>
                      <span>•</span>
                      <div className="flex gap-1">
                        {tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/assets/${asset.id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
            {assets.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No assets yet</p>
                <Link href="/admin/assets/new">
                  <Button>Create your first asset</Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
