import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseFileRefs } from "@/lib/file-utils";
import { readFile } from "fs/promises";
import { join } from "path";

// Simple rate limiting (in-memory, use Redis in production)
const downloadLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 20; // 20 downloads per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = downloadLimits.get(ip);

  if (!limit || now > limit.resetAt) {
    downloadLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (limit.count >= RATE_LIMIT_MAX) {
    return false;
  }

  limit.count++;
  return true;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const asset = await prisma.asset.findUnique({
      where: { id },
    });

    if (!asset || asset.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const files = parseFileRefs(asset.files);
    const fileIndex = parseInt(request.nextUrl.searchParams.get("file") || "0");
    const file = files[fileIndex];

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Log download
    await prisma.download.create({
      data: {
        assetId: asset.id,
        ip: ip,
        ua: request.headers.get("user-agent") || undefined,
      },
    });

    // Increment download count
    await prisma.asset.update({
      where: { id: asset.id },
      data: { downloadCount: { increment: 1 } },
    });

    // Read file
    const urlPath = file.url.startsWith("/") ? file.url.slice(1) : file.url;
    const filePath = join(process.cwd(), "public", urlPath);
    let fileBuffer: Buffer;
    try {
      fileBuffer = await readFile(filePath);
    } catch (error) {
      // If file doesn't exist, return error
      return NextResponse.json({ error: "File not found on server" }, { status: 404 });
    }

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${file.name}"`,
        "Content-Length": file.size.toString(),
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
