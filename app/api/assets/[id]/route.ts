import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { stringifyFileRefs } from "@/lib/file-utils";

const assetSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  version: z.string().optional(),
  files: z.array(z.object({
    name: z.string(),
    url: z.string(),
    size: z.number(),
    ext: z.string(),
    sha256: z.string(),
  })).optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  license: z.string().optional(),
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
    const data = assetSchema.parse(body);

    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.slug) updateData.slug = data.slug;
    if (data.description) updateData.description = data.description;
    if (data.version) updateData.version = data.version;
    if (data.files) updateData.files = stringifyFileRefs(data.files);
    if (data.categories) updateData.categories = JSON.stringify(data.categories);
    if (data.tags) updateData.tags = JSON.stringify(data.tags);
    if (data.license) updateData.license = data.license;
    if (data.status) updateData.status = data.status;

    const asset = await prisma.asset.update({
      where: { id },
      data: updateData,
    });

    await prisma.auditEvent.create({
      data: {
        actorId: (user as any).id,
        entity: "Asset",
        entityId: asset.id,
        action: "UPDATE",
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireAdmin();

    await prisma.asset.delete({
      where: { id },
    });

    await prisma.auditEvent.create({
      data: {
        actorId: (user as any).id,
        entity: "Asset",
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
