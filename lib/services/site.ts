import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { parseJsonObject, parseStringArray, stringifyJsonObject } from "@/lib/serializers";

export interface SiteSocials {
  discord?: string;
  whatsapp?: string;
  youtube?: string;
  x?: string;
  [key: string]: string | undefined;
}

export interface SiteSettingsDto {
  id: string;
  siteName: string;
  logoUrl?: string | null;
  heroTitle: string;
  heroSubtitle: string;
  featuredProductIds: string[];
  featuredAssetIds: string[];
  socials: SiteSocials;
  primaryColor: string;
  updatedAt: Date;
}

export const getSiteSettings = cache(async (): Promise<SiteSettingsDto> => {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  if (!settings) {
    const created = await prisma.siteSettings.create({
      data: {
        socials: stringifyJsonObject({
          discord: "",
          whatsapp: "",
          youtube: "",
          x: "",
        }),
      },
    });

    return {
      id: created.id,
      siteName: created.siteName,
      logoUrl: created.logoUrl,
      heroTitle: created.heroTitle,
      heroSubtitle: created.heroSubtitle,
      featuredProductIds: parseStringArray(created.featuredProductIds),
      featuredAssetIds: parseStringArray(created.featuredAssetIds),
      socials: parseJsonObject<SiteSocials>(created.socials),
      primaryColor: created.primaryColor,
      updatedAt: created.updatedAt,
    };
  }

  return {
    id: settings.id,
    siteName: settings.siteName,
    logoUrl: settings.logoUrl,
    heroTitle: settings.heroTitle,
    heroSubtitle: settings.heroSubtitle,
    featuredProductIds: parseStringArray(settings.featuredProductIds),
    featuredAssetIds: parseStringArray(settings.featuredAssetIds),
    socials: parseJsonObject<SiteSocials>(settings.socials),
    primaryColor: settings.primaryColor,
    updatedAt: settings.updatedAt,
  };
});
