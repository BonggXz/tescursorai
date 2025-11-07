import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stringifyJson } from "@/lib/utils";
import { z } from "zod";
import { createAuditEvent } from "@/lib/audit";

const productUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  priceCents: z.number().int().positive().optional(),
  robloxAssetId: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const data = productUpdateSchema.parse(body);

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.priceCents !== undefined) updateData.priceCents = data.priceCents;
    if (data.robloxAssetId !== undefined) updateData.robloxAssetId = data.robloxAssetId;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.images !== undefined) updateData.images = stringifyJson(data.images);
    if (data.tags !== undefined) updateData.tags = stringifyJson(data.tags);
    if (data.categories !== undefined) updateData.categories = stringifyJson(data.categories);

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    await createAuditEvent(user.id, "Product", product.id, "UPDATE", {
      before: existing,
      after: product,
    });

    return NextResponse.json(product);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin();
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id },
    });

    await createAuditEvent(user.id, "Product", id, "DELETE", {
      deleted: product,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
