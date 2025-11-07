'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavItem = {
  href: string;
  label: string;
  adminOnly?: boolean;
};

export type SiteHeaderProps = {
  siteName: string;
  navItems?: NavItem[];
  discordUrl?: string | null;
  showAdminLink?: boolean;
};

const defaultNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/store", label: "Store" },
  { href: "/assets", label: "Assets" },
  { href: "/admin", label: "Admin", adminOnly: true },
];

export function SiteHeader({
  siteName,
  navItems = defaultNav,
  discordUrl,
  showAdminLink = false,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const items = navItems.filter((item) =>
    item.adminOnly ? showAdminLink : true,
  );

  const renderLinks = (className?: string) =>
    items.map((item) => {
      const isActive =
        item.href === "/"
          ? pathname === "/"
          : pathname?.startsWith(item.href);
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActive ? "text-primary" : "text-muted-foreground",
            className,
          )}
        >
          {item.label}
        </Link>
      );
    });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground"
        >
          <span className="rounded-md bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
            RBLX
          </span>
          <span className="hidden md:inline-block">{siteName}</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {renderLinks()}
        </nav>

        <div className="flex items-center gap-2">
          {discordUrl ? (
            <Link
              href={discordUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "bg-primary text-primary-foreground shadow-subtle hover:bg-primary-hover",
              )}
            >
              Join Discord
            </Link>
          ) : null}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring focus-visible:ring-primary md:hidden">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Open navigation</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 sm:w-80">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold">{siteName}</span>
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring focus-visible:ring-primary"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close navigation</span>
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-4">
                {renderLinks("text-base")}
              </nav>
              {discordUrl ? (
                <Link
                  href={discordUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" }),
                    "mt-8 w-full bg-primary text-primary-foreground shadow-subtle hover:bg-primary-hover",
                  )}
                >
                  Join Discord
                </Link>
              ) : null}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
