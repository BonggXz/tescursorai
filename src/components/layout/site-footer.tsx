import Link from "next/link";
import { Youtube, MessageCircleMore, Mail, Twitter, MessagesSquare } from "lucide-react";
import type { ReactNode } from "react";

type SocialLinks = Partial<{
  discord: string;
  whatsapp: string;
  youtube: string;
  email: string;
  x: string;
}>;

type SiteFooterProps = {
  siteName?: string;
  socials?: SocialLinks;
};

const iconMap: Record<keyof SocialLinks, ReactNode> = {
  discord: <MessagesSquare className="h-4 w-4" />,
  whatsapp: <MessageCircleMore className="h-4 w-4" />,
  youtube: <Youtube className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  x: <Twitter className="h-4 w-4" />,
};

export function SiteFooter({
  siteName = "Roblox Studio Community",
  socials = {},
}: SiteFooterProps) {
  const year = new Date().getFullYear();
  const socialEntries = Object.entries(socials).filter(
    ([, value]) => typeof value === "string" && value.length > 0,
  ) as Array<[keyof SocialLinks, string]>;

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-base font-semibold text-slate-900">{siteName}</p>
          <p className="text-sm text-slate-500">
            © {year} Roblox Studio Community. Crafted for builders, scripters, and storytellers.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {socialEntries.map(([network, url]) => (
            <Link
              key={network}
              href={network === "email" ? `mailto:${url}` : url}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
              target={network === "email" ? undefined : "_blank"}
              rel={network === "email" ? undefined : "noopener noreferrer"}
            >
              {iconMap[network] ?? <Mail className="h-4 w-4" />}
              <span className="capitalize">{network}</span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
