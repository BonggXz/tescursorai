import { prisma } from "@/lib/prisma";
import { parseStringArray } from "@/lib/serialization";

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  if (!settings) {
    return null;
  }

  let socials: Record<string, unknown> = {};

  if (typeof settings.socials === "string") {
    try {
      socials = JSON.parse(settings.socials) ?? {};
    } catch {
      socials = {};
    }
  } else if (settings.socials && typeof settings.socials === "object") {
    socials = settings.socials as Record<string, unknown>;
  }

  return {
    ...settings,
    featuredProductIds: parseStringArray(settings.featuredProductIds),
    featuredAssetIds: parseStringArray(settings.featuredAssetIds),
    socials,
  };
}
