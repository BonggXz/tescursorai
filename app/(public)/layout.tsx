import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { getSiteSettings } from "@/lib/services/site";
import { getSession } from "@/lib/auth";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [settings, session] = await Promise.all([
    getSiteSettings(),
    getSession(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <SiteHeader settings={settings} userRole={session?.user.role} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
    </div>
  );
}
