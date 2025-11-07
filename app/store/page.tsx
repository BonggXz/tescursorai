import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { prisma } from '@/lib/prisma'
import { parseJsonField, formatPrice } from '@/lib/utils'
import { Code, ShoppingCart, Search } from 'lucide-react'

interface SearchParams {
  q?: string
  category?: string
  sort?: string
  page?: string
}

async function getProducts(searchParams: SearchParams) {
  const { q, category, sort } = searchParams
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

  let orderBy: any = { createdAt: 'desc' }
  if (sort === 'price-low') orderBy = { priceCents: 'asc' }
  if (sort === 'price-high') orderBy = { priceCents: 'desc' }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ])

  return { products, total, page, pageSize }
}

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { products, total } = await getProducts(params)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Store</h1>
        <p className="text-muted-foreground">
          Browse premium Roblox Studio products and tools
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            defaultValue={params.q}
            name="q"
          />
        </div>
        <Select defaultValue={params.sort || 'newest'}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {products.map((product) => {
          const tags = parseJsonField<string[]>(product.tags, [])
          return (
            <Link key={product.id} href={`/store/${product.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-md mb-4 flex items-center justify-center">
                    <Code className="h-20 w-20 text-primary" />
                  </div>
                  <CardTitle className="line-clamp-2">{product.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {product.description.substring(0, 100)}...
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(product.priceCents)}
                    </span>
                    <Button size="sm">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          )
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found</p>
        </div>
      )}

      {/* Pagination info */}
      {total > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {products.length} of {total} products
        </div>
      )}
    </div>
  )
}
