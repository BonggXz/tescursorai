"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLinks, type NavLinkItem } from "@/components/site/nav-links";

interface MobileNavProps {
  items: NavLinkItem[];
  discordUrl?: string;
}

export function MobileNav({ items, discordUrl }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="text-left text-base font-semibold">
            Menu
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <NavLinks
            items={items}
            orientation="vertical"
            onNavigate={() => setOpen(false)}
          />
          {discordUrl ? (
            <Button
              asChild
              className="w-full"
              onClick={() => setOpen(false)}
            >
              <a href={discordUrl} target="_blank" rel="noreferrer">
                Join our Discord
              </a>
            </Button>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
