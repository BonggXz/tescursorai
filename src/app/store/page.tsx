import Link from 'next/link'
import { Suspense } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { prisma } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import { Providers } from '../providers'

export const dynamic = 'force-dynamic'

async function getProducts(searchParams: {
  q?: string
  category?: string
  tag?: string
  sort?: string
}) {
  const { q, category, tag, sort = 'newest' } = searchParams

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

  let orderBy: any = { createdAt: 'desc' }
  if (sort === 'price-low') orderBy = { priceCents: 'asc' }
  if (sort === 'price-high') orderBy = { priceCents: 'desc' }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    take: 50,
  })

  return products
}

async function getAllTags() {
  const products = await prisma.product.findMany({
    where: { status: 'PUBLISHED' },
    select: { tags: true },
  })

  const allTags = new Set<string>()
  products.forEach((p) => {
    const tags = JSON.parse(p.tags || '[]')
    tags.forEach((tag: string) => allTags.add(tag))
  })

  return Array.from(allTags).sort()
}

async function getAllCategories() {
  const products = await prisma.product.findMany({
    where: { status: 'PUBLISHED' },
    select: { categories: true },
  })

  const allCategories = new Set<string>()
  products.forEach((p) => {
    const categories = JSON.parse(p.categories || '[]')
    categories.forEach((cat: string) => allCategories.add(cat))
  })

  return Array.from(allCategories).sort()
}

export default async function StorePage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; tag?: string; sort?: string }
}) {
  const products = await getProducts(searchParams)
  const allTags = await getAllTags()
  const allCategories = await getAllCategories()

  return (
    <Providers>
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 py-12">
          <div className="container">
            <h1 className="text-4xl font-bold mb-8">Store</h1>

            {/* Filters */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <form action="/store" method="get">
                  <Input
                    name="q"
                    placeholder="Search products..."
                    defaultValue={searchParams.q}
                  />
                </form>
              </div>
              <div>
                <form action="/store" method="get">
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
              <div>
                <form action="/store" method="get">
                  <Select name="sort" defaultValue={searchParams.sort || 'newest'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
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
                    <Link key={tag} href={`/store?tag=${tag}`}>
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

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const tags = JSON.parse(product.tags || '[]')
                return (
                  <Link key={product.id} href={`/store/${product.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <CardTitle className="mb-2 line-clamp-2">
                          {product.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3 mb-4">
                          {product.description.substring(0, 120)}...
                        </CardDescription>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {tags.slice(0, 3).map((tag: string) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(product.priceCents)}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No products found. Try adjusting your search.
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
