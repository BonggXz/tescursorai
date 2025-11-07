import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { createAuditEvent } from "@/lib/audit";
import { z } from "zod";

const productSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  priceCents: z.number().int().min(0),
  robloxAssetId: z.string().optional(),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  images: z.array(z.string()),
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

    await createAuditEvent({
      actorId: (user as any).id,
      entity: "Product",
      entityId: product.id,
      action: "CREATE",
      diff: JSON.stringify(data),
    });

    return NextResponse.json(product);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const body = await request.json();
    const data = productSchema.partial().parse(body);

    const oldProduct = await prisma.product.findUnique({ where: { id } });
    if (!oldProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(data.images && { images: JSON.stringify(data.images) }),
        ...(data.categories && { categories: JSON.stringify(data.categories) }),
        ...(data.tags && { tags: JSON.stringify(data.tags) }),
      },
    });

    await createAuditEvent({
      actorId: (user as any).id,
      entity: "Product",
      entityId: product.id,
      action: "UPDATE",
      diff: JSON.stringify({ old: oldProduct, new: data }),
    });

    return NextResponse.json(product);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const product = await prisma.product.delete({
      where: { id },
    });

    await createAuditEvent({
      actorId: (user as any).id,
      entity: "Product",
      entityId: id,
      action: "DELETE",
      diff: null,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
