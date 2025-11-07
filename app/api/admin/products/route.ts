import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = productSchema.parse({
      ...body,
      images: body.images ? JSON.parse(body.images) : [],
      categories: body.categories ? JSON.parse(body.categories) : [],
      tags: body.tags ? JSON.parse(body.tags) : [],
    })

    // Create product
    const product = await prisma.product.create({
      data: {
        ...validatedData,
        images: body.images || '[]',
        categories: body.categories || '[]',
        tags: body.tags || '[]',
      },
    })

    // Create audit log
    await prisma.auditEvent.create({
      data: {
        actorId: session.user.id,
        entity: 'Product',
        entityId: product.id,
        action: 'CREATE',
        diff: JSON.stringify({ title: product.title, status: product.status }),
      },
    })

    return NextResponse.json(product)
  } catch (error: any) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 400 }
    )
  }
}
