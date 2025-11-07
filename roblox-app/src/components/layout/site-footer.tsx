import Link from "next/link";
import {
  MessagesSquare,
  Youtube,
  MessageCircle,
  Twitter,
  Globe,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const SOCIAL_ICON_MAP: Record<string, { label: string; icon: LucideIcon }> = {
  discord: { label: "Discord", icon: MessagesSquare },
  youtube: { label: "YouTube", icon: Youtube },
  whatsapp: { label: "WhatsApp", icon: MessageCircle },
  x: { label: "X (Twitter)", icon: Twitter },
  website: { label: "Website", icon: Globe },
};

export type SiteFooterProps = {
  siteName: string;
  socials?: Record<string, string | null | undefined>;
};

export function SiteFooter({
  siteName,
  socials: socialLinks = {},
}: SiteFooterProps) {
  return (
    <footer className="border-t border-border/60 bg-background py-12">
      <div className="container flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Roblox Studio Community
          </p>
          <h3 className="text-2xl font-heading font-semibold text-foreground">
            {siteName}
          </h3>
          <p className="text-sm text-muted-foreground">
            Build, share, and scale your Roblox experiences with tools, assets,
            and a vibrant community of creators.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/store" className="hover:text-primary">
                  Store
                </Link>
              </li>
              <li>
                <Link href="/assets" className="hover:text-primary">
                  Assets &amp; Scripts
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Connect
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {Object.entries(socialLinks).map(([key, href]) => {
                if (!href) return null;
                const mapping = SOCIAL_ICON_MAP[key] ?? {
                  label: key,
                  icon: Globe,
                };
                const Icon = mapping.icon;
                return (
                  <li key={key}>
                    <Link
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 hover:text-primary"
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                      <span>{mapping.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className="container mt-12 flex flex-col items-center justify-between gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row">
        <p>
          &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
        </p>
        <p className="text-xs">
          Crafted for Roblox Studio creators with care and attention to detail.
        </p>
      </div>
    </footer>
  );
}
