import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const productSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  priceCents: z.number().int().min(0).optional(),
  images: z.array(z.string()).optional(),
  robloxAssetId: z.string().optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireAdmin();
    const body = await request.json();
    const data = productSchema.parse(body);

    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.slug) updateData.slug = data.slug;
    if (data.description) updateData.description = data.description;
    if (data.priceCents !== undefined) updateData.priceCents = data.priceCents;
    if (data.images) updateData.images = JSON.stringify(data.images);
    if (data.robloxAssetId !== undefined) updateData.robloxAssetId = data.robloxAssetId;
    if (data.categories) updateData.categories = JSON.stringify(data.categories);
    if (data.tags) updateData.tags = JSON.stringify(data.tags);
    if (data.status) updateData.status = data.status;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    await prisma.auditEvent.create({
      data: {
        actorId: (user as any).id,
        entity: "Product",
        entityId: product.id,
        action: "UPDATE",
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireAdmin();

    await prisma.product.delete({
      where: { id },
    });

    await prisma.auditEvent.create({
      data: {
        actorId: (user as any).id,
        entity: "Product",
        entityId: id,
        action: "DELETE",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message.includes("Admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
