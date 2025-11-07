import { ReactNode } from "react";

import { SiteShell } from "@/components/layout/site-shell";
import { getSiteSettings } from "@/server/settings";

type PublicLayoutProps = {
  children: ReactNode;
};

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const settings = await getSiteSettings();

  return (
    <SiteShell
      siteName={settings.siteName}
      socials={settings.socials}
      showAdminLink={false}
    >
      {children}
    </SiteShell>
  );
}
