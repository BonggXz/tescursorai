import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Simple in-memory rate limiter
const downloadTracking = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = 20 // downloads per window
  const window = 60 * 1000 // 1 minute

  const tracker = downloadTracking.get(ip)
  
  if (!tracker || tracker.resetAt < now) {
    downloadTracking.set(ip, { count: 1, resetAt: now + window })
    return true
  }

  if (tracker.count >= limit) {
    return false
  }

  tracker.count++
  return true
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const searchParams = request.nextUrl.searchParams
    const fileId = searchParams.get('fileId')

    if (!fileId) {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 })
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    // Get asset and file
    const asset = await prisma.asset.findUnique({
      where: { id, status: 'PUBLISHED' },
      include: { files: { where: { id: fileId } } },
    })

    if (!asset || asset.files.length === 0) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const file = asset.files[0]

    // Get session for user tracking
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    // Log download
    await Promise.all([
      prisma.download.create({
        data: {
          assetId: asset.id,
          userId: userId || null,
          ip,
          ua: request.headers.get('user-agent') || null,
        },
      }),
      prisma.asset.update({
        where: { id: asset.id },
        data: { downloadCount: { increment: 1 } },
      }),
    ])

    // In a real app, you'd stream the actual file from storage
    // For demo purposes, we'll return a placeholder response
    const content = `-- ${asset.title}
-- Version: ${asset.version}
-- License: ${asset.license}
-- 
-- This is a demo file. In production, the actual file would be served here.

print("Hello from ${asset.title}!")
`

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${file.name}"`,
        'X-Download-Count': asset.downloadCount.toString(),
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
