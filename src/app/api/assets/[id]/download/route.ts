import { promises as fs } from "node:fs";
import path from "node:path";

import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { getRequestFingerprint, rateLimit } from "@/lib/rate-limit";
import { assertAllowedOrigin } from "@/lib/security";
import { prisma } from "@/lib/prisma";
import { incrementAssetDownload } from "@/server/queries/assets";

type Params = {
  params: { id: string };
};

const DOWNLOAD_LIMIT = Number(process.env.DOWNLOAD_RATE_LIMIT ?? "20");
const DOWNLOAD_WINDOW_MS = Number(process.env.DOWNLOAD_RATE_WINDOW_MS ?? "60000") || 60_000;

export async function GET(request: Request, { params }: Params) {
  assertAllowedOrigin(request);

  const fingerprint = getRequestFingerprint(request);
  const rateState = rateLimit({
    uniqueToken: `download:${fingerprint}`,
    limit: DOWNLOAD_LIMIT,
    windowMs: DOWNLOAD_WINDOW_MS,
  });

  if (!rateState.success) {
    return NextResponse.json(
      {
        error: "Too many downloads from this IP. Please try again in a moment.",
      },
      { status: 429 },
    );
  }

  const asset = await prisma.asset.findUnique({
    where: {
      id: params.id,
      status: "PUBLISHED",
    },
    include: {
      files: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!asset || asset.files.length === 0) {
    return NextResponse.json({ error: "Asset not found." }, { status: 404 });
  }

  const file = asset.files[0];
  const filePath = path.join(process.cwd(), "public", file.url.replace(/^\//, ""));

  try {
    const buffer = await fs.readFile(filePath);
    const session = await getServerAuthSession();

    await incrementAssetDownload(asset.id, {
      ip: request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip"),
      ua: request.headers.get("user-agent"),
      userId: session?.user?.id,
    });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": buffer.length.toString(),
        "Content-Disposition": `attachment; filename="${encodeURIComponent(file.name)}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to serve asset download", error);
    return NextResponse.json({ error: "Unable to download asset." }, { status: 500 });
  }
}
