import { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

type SiteShellProps = {
  children: ReactNode;
  siteName: string;
  socials?: Record<string, string | null | undefined>;
  showAdminLink?: boolean;
};

export function SiteShell({
  children,
  siteName,
  socials,
  showAdminLink,
}: SiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        siteName={siteName}
        discordUrl={socials?.discord ?? undefined}
        showAdminLink={showAdminLink}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter siteName={siteName} socials={socials} />
    </div>
  );
}
