import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { headers } from 'next/headers'

// Simple in-memory rate limiter
const downloadLimits = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = downloadLimits.get(ip)

  if (!limit || now > limit.resetAt) {
    downloadLimits.set(ip, {
      count: 1,
      resetAt: now + 60 * 1000, // 1 minute
    })
    return true
  }

  if (limit.count >= 20) {
    return false
  }

  limit.count++
  return true
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get client IP
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for') || 'unknown'

    // Rate limit check
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    // Get asset
    const asset = await prisma.asset.findUnique({
      where: { id: params.id, status: 'PUBLISHED' },
      include: { files: true },
    })

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    // Log download
    await prisma.download.create({
      data: {
        assetId: asset.id,
        ip,
        ua: headersList.get('user-agent') || undefined,
      },
    })

    // Increment download count
    await prisma.asset.update({
      where: { id: asset.id },
      data: { downloadCount: { increment: 1 } },
    })

    // For now, return a JSON response with file info
    // In production, you'd create a zip file or redirect to file storage
    return NextResponse.json({
      message: 'Download initiated',
      asset: {
        title: asset.title,
        version: asset.version,
        files: asset.files.map((f) => ({
          name: f.name,
          url: f.url,
          size: f.size,
        })),
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Failed to process download' },
      { status: 500 }
    )
  }
}
