import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stringifyJson } from "@/lib/utils";
import { createAuditEvent } from "@/lib/audit";

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAdmin();
    const body = await req.json();
    const { type, data } = body;

    if (type === "site") {
      const settings = await prisma.siteSettings.upsert({
        where: { id: "singleton" },
        update: {
          siteName: data.siteName,
          logoUrl: data.logoUrl,
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          primaryColor: data.primaryColor,
        },
        create: {
          id: "singleton",
          siteName: data.siteName,
          logoUrl: data.logoUrl,
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          primaryColor: data.primaryColor,
        },
      });

      await createAuditEvent(user.id, "Settings", "singleton", "UPDATE", {
        type: "site",
        data,
      });

      return NextResponse.json(settings);
    } else if (type === "social") {
      const settings = await prisma.siteSettings.upsert({
        where: { id: "singleton" },
        update: {
          socials: stringifyJson(data),
        },
        create: {
          id: "singleton",
          socials: stringifyJson(data),
        },
      });

      await createAuditEvent(user.id, "Settings", "singleton", "UPDATE", {
        type: "social",
        data,
      });

      return NextResponse.json(settings);
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
