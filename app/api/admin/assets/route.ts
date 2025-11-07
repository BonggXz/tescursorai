import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { createAuditEvent } from "@/lib/audit";
import { z } from "zod";

const assetSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  version: z.string().default("1.0.0"),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  license: z.string().default("MIT"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  files: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
      size: z.number(),
      ext: z.string(),
      sha256: z.string(),
    })
  ),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin();
    const body = await request.json();
    const data = assetSchema.parse(body);

    const asset = await prisma.asset.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        version: data.version,
        license: data.license,
        status: data.status,
        categories: JSON.stringify(data.categories),
        tags: JSON.stringify(data.tags),
        files: JSON.stringify(data.files),
      },
    });

    await createAuditEvent({
      actorId: (user as any).id,
      entity: "Asset",
      entityId: asset.id,
      action: "CREATE",
      diff: JSON.stringify(data),
    });

    return NextResponse.json(asset);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("Create asset error:", error);
    return NextResponse.json({ error: "Failed to create asset" }, { status: 500 });
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
    const data = assetSchema.partial().parse(body);

    const oldAsset = await prisma.asset.findUnique({ where: { id } });
    if (!oldAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const asset = await prisma.asset.update({
      where: { id },
      data: {
        ...data,
        ...(data.categories && { categories: JSON.stringify(data.categories) }),
        ...(data.tags && { tags: JSON.stringify(data.tags) }),
        ...(data.files && { files: JSON.stringify(data.files) }),
      },
    });

    await createAuditEvent({
      actorId: (user as any).id,
      entity: "Asset",
      entityId: asset.id,
      action: "UPDATE",
      diff: JSON.stringify({ old: oldAsset, new: data }),
    });

    return NextResponse.json(asset);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("Update asset error:", error);
    return NextResponse.json({ error: "Failed to update asset" }, { status: 500 });
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

    await prisma.asset.delete({
      where: { id },
    });

    await createAuditEvent({
      actorId: (user as any).id,
      entity: "Asset",
      entityId: id,
      action: "DELETE",
      diff: null,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error("Delete asset error:", error);
    return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 });
  }
}
