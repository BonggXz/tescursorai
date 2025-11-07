import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getClientIp, getUserAgent } from "@/lib/headers";
import { parseJson } from "@/lib/utils";
import { readFile } from "fs/promises";
import path from "path";

interface FileRef {
  name: string;
  url: string;
  ext: string;
  size: number;
  sha256: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const rateLimit = checkRateLimit(req);
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.resetAt);
    }

    const { id } = await params;
    const asset = await prisma.asset.findUnique({
      where: { id },
    });

    if (!asset || asset.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const files = parseJson<FileRef[]>(asset.files, []);
    const fileIndex = parseInt(
      req.nextUrl.searchParams.get("file") || "0"
    );
    const fileRef = files[fileIndex];

    if (!fileRef) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Increment download count
    await prisma.asset.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });

    // Log download
    const ip = await getClientIp();
    const ua = await getUserAgent();
    await prisma.download.create({
      data: {
        assetId: id,
        ip,
        ua,
      },
    });

    // Read and serve file
    const filePath = path.join(process.cwd(), "public", fileRef.url);
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileRef.name}"`,
        "Content-Length": fileRef.size.toString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Download failed" },
      { status: 500 }
    );
  }
}
