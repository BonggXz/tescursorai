import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { Plus, Edit, Download } from 'lucide-react'

async function getAssets() {
  return prisma.asset.findMany({
    orderBy: { createdAt: 'desc' },
    include: { files: true },
  })
}

export default async function AdminAssetsPage() {
  const assets = await getAssets()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Assets</h2>
        <Link href="/admin/assets/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Asset
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {assets.map((asset) => (
          <Card key={asset.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{asset.title}</h3>
                    <Badge variant="outline">v{asset.version}</Badge>
                    <Badge
                      variant={
                        asset.status === 'PUBLISHED'
                          ? 'default'
                          : asset.status === 'DRAFT'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {asset.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {asset.description.substring(0, 200)}...
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {asset.downloadCount} downloads
                    </span>
                    <span className="text-muted-foreground">
                      {asset.files.length} file(s)
                    </span>
                    <span className="text-muted-foreground">
                      Created {formatDate(asset.createdAt)}
                    </span>
                  </div>
                </div>
                <Link href={`/admin/assets/${asset.id}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        {assets.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">
                No assets yet. Create your first asset!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
