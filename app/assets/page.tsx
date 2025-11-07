import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { prisma } from '@/lib/prisma'
import { parseJsonField } from '@/lib/utils'
import { Download, Search, FileCode } from 'lucide-react'

interface SearchParams {
  q?: string
  category?: string
  tag?: string
  page?: string
}

async function getAssets(searchParams: SearchParams) {
  const { q, category, tag } = searchParams
  const page = Number(searchParams.page) || 1
  const pageSize = 12

  const where: any = { status: 'PUBLISHED' }

  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
  }

  if (category) {
    where.categories = { contains: category }
  }

  if (tag) {
    where.tags = { contains: tag }
  }

  const [assets, total] = await Promise.all([
    prisma.asset.findMany({
      where,
      orderBy: { downloadCount: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.asset.count({ where }),
  ])

  return { assets, total, page, pageSize }
}

export default async function AssetsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { assets, total } = await getAssets(params)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Free Assets & Scripts</h1>
        <p className="text-muted-foreground">
          Download free resources for your Roblox Studio projects
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            className="pl-10"
            defaultValue={params.q}
            name="q"
          />
        </div>
        <Select defaultValue={params.category}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="UI">UI</SelectItem>
            <SelectItem value="NPC">NPC</SelectItem>
            <SelectItem value="Scripts">Scripts</SelectItem>
            <SelectItem value="Utility">Utility</SelectItem>
            <SelectItem value="Building">Building</SelectItem>
            <SelectItem value="Effects">Effects</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {assets.map((asset) => {
          const tags = parseJsonField<string[]>(asset.tags, [])
          const categories = parseJsonField<string[]>(asset.categories, [])
          return (
            <Link key={asset.id} href={`/assets/${asset.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="h-40 bg-gradient-to-br from-green-100 to-green-200 rounded-md mb-4 flex items-center justify-center">
                    <FileCode className="h-16 w-16 text-green-600" />
                  </div>
                  <CardTitle className="line-clamp-2">{asset.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {categories.slice(0, 2).map((cat) => (
                      <Badge key={cat} variant="outline" className="text-xs">
                        {cat}
                      </Badge>
                    ))}
                    {tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Download className="h-4 w-4" />
                      {asset.downloadCount.toLocaleString()}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      v{asset.version}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {assets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No assets found</p>
        </div>
      )}

      {/* Pagination info */}
      {total > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {assets.length} of {total} assets
        </div>
      )}
    </div>
  )
}
