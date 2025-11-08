import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/db'
import { Package, FolderOpen, Download, TrendingUp } from 'lucide-react'

async function getStats() {
  const [
    totalProducts,
    totalAssets,
    totalDownloads,
    recentDownloads,
  ] = await Promise.all([
    prisma.product.count({ where: { status: 'PUBLISHED' } }),
    prisma.asset.count({ where: { status: 'PUBLISHED' } }),
    prisma.asset.aggregate({
      _sum: { downloadCount: true },
    }),
    prisma.download.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ])

  return {
    totalProducts,
    totalAssets,
    totalDownloads: totalDownloads._sum.downloadCount || 0,
    recentDownloads,
  }
}

async function getRecentProducts() {
  return prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  })
}

async function getRecentAssets() {
  return prisma.asset.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  })
}

export default async function AdminDashboard() {
  const stats = await getStats()
  const recentProducts = await getRecentProducts()
  const recentAssets = await getRecentAssets()

  const cards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      description: 'Published products',
    },
    {
      title: 'Total Assets',
      value: stats.totalAssets,
      icon: FolderOpen,
      description: 'Published assets',
    },
    {
      title: 'Total Downloads',
      value: stats.totalDownloads,
      icon: Download,
      description: 'All-time downloads',
    },
    {
      title: 'Last 7 Days',
      value: stats.recentDownloads,
      icon: TrendingUp,
      description: 'Downloads this week',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{product.title}</p>
                    <p className="text-sm text-muted-foreground">
                      ${(product.priceCents / 100).toFixed(2)} • {product.status}
                    </p>
                  </div>
                  <a
                    href={`/admin/products/${product.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    Edit
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Assets */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{asset.title}</p>
                    <p className="text-sm text-muted-foreground">
                      v{asset.version} • {asset.downloadCount} downloads
                    </p>
                  </div>
                  <a
                    href={`/admin/assets/${asset.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    Edit
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
