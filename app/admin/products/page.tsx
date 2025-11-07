import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/prisma'
import { parseJsonField, formatPrice, formatDate } from '@/lib/utils'
import { Plus, Edit, Trash2 } from 'lucide-react'

async function getProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your store products</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {products.map((product) => {
              const tags = parseJsonField<string[]>(product.tags, [])
              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{product.title}</h3>
                      <Badge variant={product.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                        {product.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatPrice(product.priceCents)}</span>
                      <span>•</span>
                      <span>{formatDate(product.createdAt)}</span>
                      <span>•</span>
                      <div className="flex gap-1">
                        {tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/products/${product.id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products yet</p>
                <Link href="/admin/products/new">
                  <Button>Create your first product</Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
