import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'singleton' },
    })

    return NextResponse.json(settings || {})
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      update: {
        siteName: body.siteName,
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        primaryColor: body.primaryColor,
        socials: JSON.stringify(body.socials),
      },
      create: {
        id: 'singleton',
        siteName: body.siteName,
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        primaryColor: body.primaryColor,
        socials: JSON.stringify(body.socials),
      },
    })

    // Create audit log
    await prisma.auditEvent.create({
      data: {
        actorId: (session.user as any)?.id,
        entity: 'Settings',
        entityId: 'singleton',
        action: 'UPDATE',
        diff: JSON.stringify({ updated: body }),
      },
    })

    return NextResponse.json(settings)
  } catch (error: any) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update settings' },
      { status: 400 }
    )
  }
}
