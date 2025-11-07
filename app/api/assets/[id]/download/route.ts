import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAuditEvent } from "@/lib/audit";
import { readFile } from "fs/promises";
import { join } from "path";
import { headers } from "next/headers";

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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const searchParams = request.nextUrl.searchParams;
    const fileUrl = searchParams.get("file");

    if (!fileUrl) {
      return NextResponse.json({ error: "File URL required" }, { status: 400 });
    }

    // Rate limiting
    const headersList = headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // Get asset
    const asset = await prisma.asset.findUnique({
      where: { id },
    });

    if (!asset || asset.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Get user session (optional)
    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as any).id : null;

    // Log download
    await prisma.download.create({
      data: {
        userId,
        assetId: asset.id,
        ip: ip !== "unknown" ? ip : null,
        ua: headersList.get("user-agent") || null,
      },
    });

    // Increment download count
    await prisma.asset.update({
      where: { id: asset.id },
      data: { downloadCount: { increment: 1 } },
    });

    // Read file
    const filePath = join(process.cwd(), "public", fileUrl.replace("/", ""));
    const fileBuffer = await readFile(filePath);
    const fileName = fileUrl.split("/").pop() || "download";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
