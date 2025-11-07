import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { Package, FileCode, Download, Users, TrendingUp, TrendingDown } from 'lucide-react'

async function getDashboardData() {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [
    totalProducts,
    publishedProducts,
    totalAssets,
    publishedAssets,
    totalUsers,
    recentDownloads,
    totalDownloads,
    recentProducts,
    recentAssets,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: 'PUBLISHED' } }),
    prisma.asset.count(),
    prisma.asset.count({ where: { status: 'PUBLISHED' } }),
    prisma.user.count(),
    prisma.download.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.download.count(),
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.asset.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  return {
    totalProducts,
    publishedProducts,
    totalAssets,
    publishedAssets,
    totalUsers,
    recentDownloads,
    totalDownloads,
    recentProducts,
    recentAssets,
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData()

  const stats = [
    {
      title: 'Total Products',
      value: data.totalProducts,
      subtitle: `${data.publishedProducts} published`,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Assets',
      value: data.totalAssets,
      subtitle: `${data.publishedAssets} published`,
      icon: FileCode,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Downloads (7d)',
      value: data.recentDownloads,
      subtitle: `${data.totalDownloads} total`,
      icon: Download,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: data.recentDownloads > 0 ? 'up' : 'stable',
    },
    {
      title: 'Total Users',
      value: data.totalUsers,
      subtitle: 'Registered accounts',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your Roblox Studio Community</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {stat.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
                  {stat.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
                  {stat.subtitle}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50">
                  <div>
                    <p className="font-medium">{product.title}</p>
                    <p className="text-xs text-muted-foreground">{product.status}</p>
                  </div>
                  <a
                    href={`/admin/products/${product.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    Edit
                  </a>
                </div>
              ))}
              {data.recentProducts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No products yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentAssets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50">
                  <div>
                    <p className="font-medium">{asset.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {asset.downloadCount} downloads • v{asset.version}
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
              {data.recentAssets.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No assets yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
