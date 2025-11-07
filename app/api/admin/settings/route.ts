import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'singleton' },
    })

    if (!settings) {
      // Return defaults if not found
      return NextResponse.json({
        id: 'singleton',
        siteName: 'Roblox Studio Community',
        heroTitle: 'Build together. Share faster.',
        heroSubtitle: 'A modern hub for Roblox Studio creators.',
        socials: '{}',
        featuredProductIds: '[]',
        featuredAssetIds: '[]',
        primaryColor: '#2563EB',
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      update: {
        siteName: body.siteName,
        logoUrl: body.logoUrl,
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        socials: body.socials,
        featuredProductIds: body.featuredProductIds,
        featuredAssetIds: body.featuredAssetIds,
        primaryColor: body.primaryColor,
      },
      create: {
        id: 'singleton',
        siteName: body.siteName,
        logoUrl: body.logoUrl,
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        socials: body.socials,
        featuredProductIds: body.featuredProductIds,
        featuredAssetIds: body.featuredAssetIds,
        primaryColor: body.primaryColor,
      },
    })

    // Create audit log
    await prisma.auditEvent.create({
      data: {
        actorId: session.user.id,
        entity: 'Settings',
        entityId: 'singleton',
        action: 'UPDATE',
        diff: JSON.stringify({ siteName: body.siteName }),
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
