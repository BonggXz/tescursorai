import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { prisma } from '@/lib/db'
import { Providers } from '../providers'
import { Download } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getAssets(searchParams: {
  q?: string
  category?: string
  tag?: string
}) {
  const { q, category, tag } = searchParams

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

  const assets = await prisma.asset.findMany({
    where,
    orderBy: { downloadCount: 'desc' },
    take: 50,
  })

  return assets
}

async function getAllTags() {
  const assets = await prisma.asset.findMany({
    where: { status: 'PUBLISHED' },
    select: { tags: true },
  })

  const allTags = new Set<string>()
  assets.forEach((a) => {
    const tags = JSON.parse(a.tags || '[]')
    tags.forEach((tag: string) => allTags.add(tag))
  })

  return Array.from(allTags).sort()
}

async function getAllCategories() {
  const assets = await prisma.asset.findMany({
    where: { status: 'PUBLISHED' },
    select: { categories: true },
  })

  const allCategories = new Set<string>()
  assets.forEach((a) => {
    const categories = JSON.parse(a.categories || '[]')
    categories.forEach((cat: string) => allCategories.add(cat))
  })

  return Array.from(allCategories).sort()
}

export default async function AssetsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; tag?: string }
}) {
  const assets = await getAssets(searchParams)
  const allTags = await getAllTags()
  const allCategories = await getAllCategories()

  return (
    <Providers>
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 py-12">
          <div className="container">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Free Assets & Scripts</h1>
              <p className="text-muted-foreground">
                Download free scripts, models, and tools for your Roblox games
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <form action="/assets" method="get">
                  <Input
                    name="q"
                    placeholder="Search assets..."
                    defaultValue={searchParams.q}
                  />
                </form>
              </div>
              <div>
                <form action="/assets" method="get">
                  <Select name="category" defaultValue={searchParams.category}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {allCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </form>
              </div>
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Link key={tag} href={`/assets?tag=${tag}`}>
                      <Badge
                        variant={searchParams.tag === tag ? 'default' : 'outline'}
                        className="cursor-pointer"
                      >
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Assets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assets.map((asset) => {
                const tags = JSON.parse(asset.tags || '[]')
                const categories = JSON.parse(asset.categories || '[]')
                return (
                  <Link key={asset.id} href={`/assets/${asset.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="line-clamp-2 flex-1">
                            {asset.title}
                          </CardTitle>
                          <Badge variant="outline" className="ml-2">
                            {asset.version}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {categories.slice(0, 2).map((cat: string) => (
                            <Badge key={cat} variant="secondary" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                        </div>

                        <CardDescription className="line-clamp-3 mb-4">
                          {asset.description.substring(0, 120)}...
                        </CardDescription>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {tags.slice(0, 3).map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Download className="h-4 w-4" />
                          {asset.downloadCount} downloads
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>

            {assets.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No assets found. Try adjusting your search.
                </p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </Providers>
  )
}
