import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { stringifyFileRefs, parseFileRefs } from "@/lib/file-utils";

const assetSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  version: z.string().default("1.0.0"),
  files: z.array(z.object({
    name: z.string(),
    url: z.string(),
    size: z.number(),
    ext: z.string(),
    sha256: z.string(),
  })),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  license: z.string().default("MIT"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin();
    const body = await request.json();
    const data = assetSchema.parse(body);

    const asset = await prisma.asset.create({
      data: {
        ...data,
        files: stringifyFileRefs(data.files),
        categories: JSON.stringify(data.categories),
        tags: JSON.stringify(data.tags),
      },
    });

    // Audit log
    await prisma.auditEvent.create({
      data: {
        actorId: (user as any).id,
        entity: "Asset",
        entityId: asset.id,
        action: "CREATE",
      },
    });

    return NextResponse.json(asset);
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message.includes("Admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q");
  const tag = searchParams.get("tag");
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("size") || "12");
  const skip = (page - 1) * pageSize;

  const where: any = { status: "PUBLISHED" };

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
    ];
  }

  if (tag) {
    where.tags = { contains: tag };
  }

  if (category) {
    where.categories = { contains: category };
  }

  const [assets, total] = await Promise.all([
    prisma.asset.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.asset.count({ where }),
  ]);

  return NextResponse.json({
    assets: assets.map((a) => ({
      ...a,
      files: parseFileRefs(a.files),
      categories: JSON.parse(a.categories || "[]"),
      tags: JSON.parse(a.tags || "[]"),
    })),
    total,
    page,
    pageSize,
  });
}
