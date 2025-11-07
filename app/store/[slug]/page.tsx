import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { parseJsonField, formatPrice, formatDate } from '@/lib/utils'
import { ShoppingCart, Code, Tag, Calendar } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, status: 'PUBLISHED' },
  })

  if (!product) return null

  // Get related products
  const tags = parseJsonField<string[]>(product.tags, [])
  const related = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      id: { not: product.id },
      OR: tags.length > 0 ? [{ tags: { contains: tags[0] } }] : undefined,
    },
    take: 4,
  })

  return { product, related }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getProduct(slug)

  if (!data) {
    notFound()
  }

  const { product, related } = data
  const tags = parseJsonField<string[]>(product.tags, [])
  const categories = parseJsonField<string[]>(product.categories, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Product Image */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-4 flex items-center justify-center">
              <Code className="h-32 w-32 text-primary" />
            </div>
            {product.robloxAssetId && (
              <p className="text-sm text-muted-foreground text-center">
                Asset ID: {product.robloxAssetId}
              </p>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.map((cat) => (
                <Badge key={cat} variant="outline">
                  {cat}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(product.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl font-bold text-primary">
                {formatPrice(product.priceCents)}
              </span>
              <Button size="lg" className="gap-2">
                <ShoppingCart className="h-5 w-5" />
                Purchase
              </Button>
            </div>
          </div>

          {/* Description */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-blue max-w-none">
                <ReactMarkdown>{product.description}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
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
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => {
              const itemTags = parseJsonField<string[]>(item.tags, [])
              return (
                <a key={item.id} href={`/store/${item.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-md mb-4 flex items-center justify-center">
                        <Code className="h-12 w-12 text-primary" />
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
                      <p className="text-lg font-bold text-primary">{formatPrice(item.priceCents)}</p>
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
