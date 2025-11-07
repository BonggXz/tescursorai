import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { createAuditEvent } from "@/lib/audit";
import { z } from "zod";

const settingsSchema = z.object({
  siteName: z.string().optional(),
  logoUrl: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  primaryColor: z.string().optional(),
  featuredProductIds: z.array(z.string()).optional(),
  featuredAssetIds: z.array(z.string()).optional(),
  socials: z.record(z.string()).optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAdmin();
    const body = await request.json();
    const data = settingsSchema.parse(body);

    const oldSettings = await prisma.siteSettings.findUnique({
      where: { id: "singleton" },
    });

    const settings = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {
        ...data,
        ...(data.featuredProductIds && { featuredProductIds: JSON.stringify(data.featuredProductIds) }),
        ...(data.featuredAssetIds && { featuredAssetIds: JSON.stringify(data.featuredAssetIds) }),
        ...(data.socials && { socials: JSON.stringify(data.socials) }),
      },
      create: {
        id: "singleton",
        ...data,
        featuredProductIds: JSON.stringify(data.featuredProductIds || []),
        featuredAssetIds: JSON.stringify(data.featuredAssetIds || []),
        socials: JSON.stringify(data.socials || {}),
      },
    });

    await createAuditEvent({
      actorId: (user as any).id,
      entity: "Settings",
      entityId: "singleton",
      action: "UPDATE",
      diff: JSON.stringify({ old: oldSettings, new: data }),
    });

    return NextResponse.json(settings);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
