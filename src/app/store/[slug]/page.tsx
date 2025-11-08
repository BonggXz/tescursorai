import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import { Providers } from '@/app/providers'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ShoppingCart, ArrowLeft } from 'lucide-react'

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, status: 'PUBLISHED' },
  })

  if (!product) return null
  return product
}

async function getRelatedProducts(productId: string, tags: string[]) {
  const products = await prisma.product.findMany({
    where: {
      id: { not: productId },
      status: 'PUBLISHED',
      tags: { contains: tags[0] || '' },
    },
    take: 4,
  })

  return products
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  const tags = JSON.parse(product.tags || '[]')
  const categories = JSON.parse(product.categories || '[]')
  const images = JSON.parse(product.images || '[]')
  const relatedProducts = await getRelatedProducts(product.id, tags)

  return (
    <Providers>
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 py-12">
          <div className="container">
            <Link href="/store" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="h-4 w-4" />
              Back to Store
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h1 className="text-4xl font-bold mb-4">{product.title}</h1>

                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map((cat: string) => (
                    <Badge key={cat} variant="outline">
                      {cat}
                    </Badge>
                  ))}
                  {tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Images Placeholder */}
                {images.length > 0 && (
                  <div className="mb-8 bg-slate-100 rounded-lg p-12 text-center">
                    <p className="text-muted-foreground">Product Images</p>
                  </div>
                )}

                {/* Description */}
                <div className="prose max-w-none">
                  <MDXRemote source={product.description} />
                </div>

                {/* Roblox Asset ID */}
                {product.robloxAssetId && (
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium">
                      Roblox Asset ID: <span className="font-mono">{product.robloxAssetId}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div>
                <Card className="sticky top-24">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-primary mb-6">
                      {formatPrice(product.priceCents)}
                    </div>

                    <Button size="lg" className="w-full gap-2 mb-4">
                      <ShoppingCart className="h-5 w-5" />
                      Purchase
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Secure checkout powered by Stripe
                    </p>

                    <div className="mt-6 pt-6 border-t space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">License</span>
                        <span className="font-medium">Commercial Use</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Updates</span>
                        <span className="font-medium">Lifetime</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Support</span>
                        <span className="font-medium">6 Months</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="mt-20">
                <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((related) => {
                    const relatedTags = JSON.parse(related.tags || '[]')
                    return (
                      <Link key={related.id} href={`/store/${related.slug}`}>
                        <Card className="h-full hover:shadow-lg transition-shadow">
                          <CardContent className="pt-6">
                            <CardTitle className="mb-2 text-base line-clamp-2">
                              {related.title}
                            </CardTitle>
                            <div className="flex flex-wrap gap-1 mb-4">
                              {relatedTags.slice(0, 2).map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-xl font-bold text-primary">
                              {formatPrice(related.priceCents)}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </Providers>
  )
}
