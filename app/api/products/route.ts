import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { stringifyFileRefs, parseFileRefs } from "@/lib/file-utils";

const productSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  priceCents: z.number().int().min(0),
  images: z.array(z.string()),
  robloxAssetId: z.string().optional(),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin();
    const body = await request.json();
    const data = productSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        ...data,
        images: JSON.stringify(data.images),
        categories: JSON.stringify(data.categories),
        tags: JSON.stringify(data.tags),
      },
    });

    // Audit log
    await prisma.auditEvent.create({
      data: {
        actorId: (user as any).id,
        entity: "Product",
        entityId: product.id,
        action: "CREATE",
      },
    });

    return NextResponse.json(product);
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
  const sort = searchParams.get("sort") || "newest";
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

  const orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") {
    orderBy.priceCents = "asc";
  } else if (sort === "price-desc") {
    orderBy.priceCents = "desc";
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    products: products.map((p) => ({
      ...p,
      images: JSON.parse(p.images || "[]"),
      categories: JSON.parse(p.categories || "[]"),
      tags: JSON.parse(p.tags || "[]"),
    })),
    total,
    page,
    pageSize,
  });
}
