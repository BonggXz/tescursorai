import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Toaster } from "@/components/ui/toaster";
import { getCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { getSiteSettings } from "@/server/queries/site-settings";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Roblox Studio Community",
    template: "%s | Roblox Studio Community",
  },
  description: "Build together and share faster with a modern Roblox Studio community hub.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, settings] = await Promise.all([getCurrentUser(), getSiteSettings()]);
  const socials = (settings?.socials ?? {}) as Record<string, string>;

  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body
        className={cn(
          "flex min-h-screen flex-col bg-background font-sans text-foreground",
          inter.variable,
        )}
      >
        <SiteHeader
          user={user}
          siteName={settings?.siteName ?? undefined}
          discordUrl={socials.discord}
        />
        <main className="flex-1">{children}</main>
        <SiteFooter siteName={settings?.siteName ?? undefined} socials={socials} />
        <Toaster />
      </body>
    </html>
  );
}
