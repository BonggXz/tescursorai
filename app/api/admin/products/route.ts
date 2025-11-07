import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stringifyJson } from "@/lib/utils";
import { z } from "zod";
import { createAuditEvent } from "@/lib/audit";

const productSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  priceCents: z.number().int().positive(),
  robloxAssetId: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin();
    const body = await req.json();
    const data = productSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        ...data,
        images: stringifyJson(data.images),
        tags: stringifyJson(data.tags),
        categories: stringifyJson(data.categories),
      },
    });

    await createAuditEvent(user.id, "Product", product.id, "CREATE", {});

    return NextResponse.json(product);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
