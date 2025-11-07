import "server-only";

import { defaultSiteSettings } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { jsonToStringArray, jsonToRecord } from "@/lib/json";

export type SiteSettings = {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryColor: string;
  logoUrl?: string | null;
  featuredProductIds: string[];
  featuredAssetIds: string[];
  socials: Record<string, string | null>;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const record = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  if (!record) {
    return {
      siteName: defaultSiteSettings.siteName,
      heroTitle: defaultSiteSettings.heroTitle,
      heroSubtitle: defaultSiteSettings.heroSubtitle,
      primaryColor: defaultSiteSettings.primaryColor,
      logoUrl: defaultSiteSettings.logoUrl ?? null,
      featuredProductIds: [],
      featuredAssetIds: [],
      socials: defaultSiteSettings.socials,
    };
  }

  return {
    siteName: record.siteName,
    heroTitle: record.heroTitle,
    heroSubtitle: record.heroSubtitle,
    primaryColor: record.primaryColor,
    logoUrl: record.logoUrl,
    featuredProductIds: jsonToStringArray(record.featuredProductIds),
    featuredAssetIds: jsonToStringArray(record.featuredAssetIds),
    socials: {
      ...defaultSiteSettings.socials,
      ...jsonToRecord(record.socials),
    },
  };
}
