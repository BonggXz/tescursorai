import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/db'
import { formatPrice, formatDate } from '@/lib/utils'
import { Plus, Edit } from 'lucide-react'

async function getProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Products</h2>
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{product.title}</h3>
                    <Badge
                      variant={
                        product.status === 'PUBLISHED'
                          ? 'default'
                          : product.status === 'DRAFT'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {product.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {product.description.substring(0, 200)}...
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-semibold text-primary">
                      {formatPrice(product.priceCents)}
                    </span>
                    <span className="text-muted-foreground">
                      Created {formatDate(product.createdAt)}
                    </span>
                  </div>
                </div>
                <Link href={`/admin/products/${product.id}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        {products.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">
                No products yet. Create your first product!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
