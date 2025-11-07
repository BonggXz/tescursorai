import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/prisma'
import { parseJsonField, formatPrice } from '@/lib/utils'
import { ArrowRight, Code, Users, Zap, Download, ShoppingCart } from 'lucide-react'

async function getHomeData() {
  const [settings, products, assets] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
    prisma.product.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.asset.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { downloadCount: 'desc' },
      take: 6,
    }),
  ])

  return { settings, products, assets }
}

export default async function HomePage() {
  const { settings, products, assets } = await getHomeData()

  const socials = settings ? parseJsonField<Record<string, string>>(settings.socials, {}) : {}

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              {settings?.heroTitle || 'Build together. Share faster.'}
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              {settings?.heroSubtitle || 'A modern hub for Roblox Studio creators.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/store">
                <Button size="lg" className="gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Visit Store
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/assets">
                <Button size="lg" variant="outline" className="gap-2">
                  <Download className="h-5 w-5" />
                  Browse Assets
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Community?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Premium Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All products and assets are carefully reviewed to ensure the highest quality standards.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Active Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Join thousands of developers sharing knowledge and collaborating on projects.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Fast Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Regular updates and new content added weekly to keep your projects fresh.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link href="/store">
              <Button variant="outline">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => {
              const tags = parseJsonField<string[]>(product.tags, [])
              return (
                <Link key={product.id} href={`/store/${product.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-md mb-4 flex items-center justify-center">
                        <Code className="h-16 w-16 text-primary" />
                      </div>
                      <CardTitle className="line-clamp-1">{product.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 mb-3">
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
        </div>
      </section>

      {/* Popular Assets */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Popular Free Assets</h2>
            <Link href="/assets">
              <Button variant="outline">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => {
              const tags = parseJsonField<string[]>(asset.tags, [])
              return (
                <Link key={asset.id} href={`/assets/${asset.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-md mb-4 flex items-center justify-center">
                        <Download className="h-12 w-12 text-green-600" />
                      </div>
                      <CardTitle className="line-clamp-1">{asset.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join our community and start building amazing Roblox experiences today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {socials.discord && (
              <a href={socials.discord} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="secondary">
                  Join Discord
                </Button>
              </a>
            )}
            {socials.youtube && (
              <a href={socials.youtube} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                  Watch Tutorials
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
