import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stringifyJson } from "@/lib/utils";
import { z } from "zod";
import { createAuditEvent } from "@/lib/audit";

const assetSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  version: z.string().default("1.0.0"),
  license: z.string().default("MIT"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  files: z.array(z.any()).default([]),
  tags: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin();
    const body = await req.json();
    const data = assetSchema.parse(body);

    const asset = await prisma.asset.create({
      data: {
        ...data,
        files: stringifyJson(data.files),
        tags: stringifyJson(data.tags),
        categories: stringifyJson(data.categories),
      },
    });

    await createAuditEvent(user.id, "Asset", asset.id, "CREATE", {});

    return NextResponse.json(asset);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to create asset" },
      { status: 500 }
    );
  }
}
