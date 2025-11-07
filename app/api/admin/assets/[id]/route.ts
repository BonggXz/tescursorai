import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stringifyJson } from "@/lib/utils";
import { z } from "zod";
import { createAuditEvent } from "@/lib/audit";

const assetUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  version: z.string().optional(),
  license: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  files: z.array(z.any()).optional(),
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
    const data = assetUpdateSchema.parse(body);

    const existing = await prisma.asset.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.version !== undefined) updateData.version = data.version;
    if (data.license !== undefined) updateData.license = data.license;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.files !== undefined) updateData.files = stringifyJson(data.files);
    if (data.tags !== undefined) updateData.tags = stringifyJson(data.tags);
    if (data.categories !== undefined) updateData.categories = stringifyJson(data.categories);

    const asset = await prisma.asset.update({
      where: { id },
      data: updateData,
    });

    await createAuditEvent(user.id, "Asset", asset.id, "UPDATE", {
      before: existing,
      after: asset,
    });

    return NextResponse.json(asset);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to update asset" },
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
    const asset = await prisma.asset.findUnique({
      where: { id },
    });

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    await prisma.asset.delete({
      where: { id },
    });

    await createAuditEvent(user.id, "Asset", id, "DELETE", {
      deleted: asset,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete asset" },
      { status: 500 }
    );
  }
}
