import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { SiteSettingsDto } from "@/lib/services/site";
import { Share2, Youtube, MessageCircle, Twitter } from "lucide-react";

interface SiteFooterProps {
  settings: SiteSettingsDto;
}

const navItems = [
  { href: "/", label: "Home" },
  { href: "/store", label: "Store" },
  { href: "/assets", label: "Assets" },
];

const socialIconMap: Record<string, ReactNode> = {
  discord: <Share2 className="h-4 w-4" />,
  whatsapp: <MessageCircle className="h-4 w-4" />,
  youtube: <Youtube className="h-4 w-4" />,
  x: <Twitter className="h-4 w-4" />,
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const socials = Object.entries(settings.socials).filter(
    ([, value]) => Boolean(value),
  );

  return (
    <footer className="border-t border-slate-200/60 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900">
            {settings.siteName}
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {settings.siteName}. All rights
            reserved.
          </p>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
          <nav className="flex gap-4 text-sm text-muted-foreground">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-3">
            {socials.map(([key, value]) => (
              <a
                key={key}
                href={value}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/70 text-slate-600 transition hover:border-primary hover:text-primary",
                )}
              >
                {socialIconMap[key] ?? (
                  <span className="text-sm capitalize">{key}</span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
