import Link from "next/link";
import type { Role } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SiteSettingsDto } from "@/lib/services/site";
import { NavLinks, type NavLinkItem } from "@/components/site/nav-links";
import { MobileNav } from "@/components/site/mobile-nav";

interface SiteHeaderProps {
  settings: SiteSettingsDto;
  userRole?: Role;
}

export function SiteHeader({ settings, userRole }: SiteHeaderProps) {
  const navItems: NavLinkItem[] = [
    { href: "/", label: "Home" },
    { href: "/store", label: "Store" },
    { href: "/assets", label: "Assets" },
  ];

  if (userRole === "ADMIN") {
    navItems.push({ href: "/admin", label: "Admin" });
  }

  const discordUrl = settings.socials.discord;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/70 bg-white/90 backdrop-blur transition-all">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 text-lg font-semibold text-slate-900",
            )}
          >
            {settings.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.logoUrl}
                alt={settings.siteName}
                className="h-8 w-auto"
              />
            ) : null}
            <span className="hidden sm:inline">{settings.siteName}</span>
          </Link>
          <div className="hidden md:block">
            <NavLinks items={navItems} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {discordUrl ? (
            <Button
              asChild
              className="hidden md:inline-flex"
              variant="default"
            >
              <a href={discordUrl} target="_blank" rel="noreferrer">
                Join our Discord
              </a>
            </Button>
          ) : null}
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link href="/login">Sign in</Link>
          </Button>
          <MobileNav items={navItems} discordUrl={discordUrl} />
        </div>
      </div>
    </header>
  );
}
