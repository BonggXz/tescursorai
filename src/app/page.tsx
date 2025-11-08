import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { prisma } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import { Providers } from './providers'
import { Store, Download, Zap, Users, Shield, Rocket } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getSettings() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'singleton' },
  })
  return settings
}

async function getFeaturedProducts() {
  const settings = await getSettings()
  if (!settings) return []
  
  const ids = JSON.parse(settings.featuredProductIds || '[]')
  if (ids.length === 0) {
    return prisma.product.findMany({
      where: { status: 'PUBLISHED' },
      take: 4,
      orderBy: { createdAt: 'desc' },
    })
  }
  
  return prisma.product.findMany({
    where: { id: { in: ids }, status: 'PUBLISHED' },
  })
}

async function getFeaturedAssets() {
  const settings = await getSettings()
  if (!settings) return []
  
  const ids = JSON.parse(settings.featuredAssetIds || '[]')
  if (ids.length === 0) {
    return prisma.asset.findMany({
      where: { status: 'PUBLISHED' },
      take: 6,
      orderBy: { downloadCount: 'desc' },
    })
  }
  
  return prisma.asset.findMany({
    where: { id: { in: ids }, status: 'PUBLISHED' },
  })
}

export default async function HomePage() {
  const settings = await getSettings()
  const featuredProducts = await getFeaturedProducts()
  const featuredAssets = await getFeaturedAssets()
  
  const socials = settings ? JSON.parse(settings.socials || '{}') : {}

  const features = [
    {
      icon: Store,
      title: 'Premium Store',
      description: 'High-quality assets and systems for your Roblox games',
    },
    {
      icon: Download,
      title: 'Free Downloads',
      description: 'Access hundreds of free scripts and models',
    },
    {
      icon: Zap,
      title: 'Ready to Use',
      description: 'Drop-in solutions that work out of the box',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by developers, for developers',
    },
    {
      icon: Shield,
      title: 'Secure & Tested',
      description: 'All content is reviewed and tested',
    },
    {
      icon: Rocket,
      title: 'Regular Updates',
      description: 'New content added weekly',
    },
  ]

  return (
    <Providers>
      <div className="flex min-h-screen flex-col">
        <Header />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                {settings?.heroTitle || 'Build together. Share faster.'}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {settings?.heroSubtitle || 'A modern hub for Roblox Studio creators.'}
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/store">
                  <Button size="lg" className="gap-2">
                    <Store className="h-5 w-5" />
                    Visit Store
                  </Button>
                </Link>
                <Link href="/assets">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Download className="h-5 w-5" />
                    Browse Assets
                  </Button>
                </Link>
              </div>
              
              {/* Social Links */}
              {Object.keys(socials).length > 0 && (
                <div className="mt-8 flex gap-4 justify-center">
                  {socials.discord && (
                    <a
                      href={socials.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      Join our Discord
                    </a>
                  )}
                  {socials.youtube && (
                    <a
                      href={socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      YouTube
                    </a>
                  )}
                  {socials.x && (
                    <a
                      href={socials.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      X (Twitter)
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Our Community?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <Card key={i} className="border-2">
                  <CardContent className="pt-6">
                    <feature.icon className="h-12 w-12 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="py-20 bg-slate-50">
            <div className="container">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Featured Products</h2>
                <Link href="/store">
                  <Button variant="outline">View All</Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => {
                  const tags = JSON.parse(product.tags || '[]')
                  return (
                    <Link key={product.id} href={`/store/${product.slug}`}>
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <CardTitle className="mb-2 line-clamp-1">
                            {product.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 mb-4">
                            {product.description.substring(0, 100)}...
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
            </div>
          </section>
        )}

        {/* Featured Assets */}
        {featuredAssets.length > 0 && (
          <section className="py-20">
            <div className="container">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Popular Free Assets</h2>
                <Link href="/assets">
                  <Button variant="outline">View All</Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredAssets.map((asset) => {
                  const tags = JSON.parse(asset.tags || '[]')
                  return (
                    <Link key={asset.id} href={`/assets/${asset.slug}`}>
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-2">
                            <CardTitle className="line-clamp-1">
                              {asset.title}
                            </CardTitle>
                            <Badge variant="outline">{asset.version}</Badge>
                          </div>
                          <CardDescription className="line-clamp-2 mb-4">
                            {asset.description.substring(0, 100)}...
                          </CardDescription>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {tags.slice(0, 3).map((tag: string) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {asset.downloadCount} downloads
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </Providers>
  )
}
