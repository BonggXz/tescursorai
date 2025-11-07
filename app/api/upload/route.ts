import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import crypto from 'crypto'

const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads'
const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB

const ALLOWED_EXTENSIONS = ['.lua', '.rbxm', '.rbxmx', '.png', '.jpg', '.jpeg', '.webp']

async function computeSha256(buffer: Buffer): Promise<string> {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit` },
        { status: 400 }
      )
    }

    // Validate file extension
    const ext = path.extname(file.name).toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}` },
        { status: 400 }
      )
    }

    // Read file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Compute SHA-256
    const sha256 = await computeSha256(buffer)

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = crypto.randomBytes(8).toString('hex')
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const uniqueFileName = `${timestamp}-${randomString}-${safeFileName}`

    // Ensure upload directory exists
    const uploadPath = path.join(process.cwd(), UPLOAD_DIR)
    if (!existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true })
    }

    // Write file
    const filePath = path.join(uploadPath, uniqueFileName)
    await writeFile(filePath, buffer)

    // Return file metadata
    const fileUrl = `/uploads/${uniqueFileName}`
    
    return NextResponse.json({
      url: fileUrl,
      name: file.name,
      size: file.size,
      ext,
      sha256,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
