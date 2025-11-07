import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'
import { productSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const validated = productSchema.parse({
      ...body,
      images: body.images || [],
    })

    const product = await prisma.product.create({
      data: {
        ...validated,
        images: JSON.stringify(validated.images),
        categories: JSON.stringify(validated.categories),
        tags: JSON.stringify(validated.tags),
      },
    })

    // Create audit log
    await prisma.auditEvent.create({
      data: {
        actorId: (session.user as any)?.id,
        entity: 'Product',
        entityId: product.id,
        action: 'CREATE',
        diff: JSON.stringify({ created: validated }),
      },
    })

    return NextResponse.json(product)
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 400 }
    )
  }
}
