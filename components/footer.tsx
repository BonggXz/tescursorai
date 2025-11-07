import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/utils";

export async function Footer() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  const socials = settings
    ? parseJson<Record<string, string>>(settings.socials, {})
    : {};

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              Roblox Studio Community
            </h3>
            <p className="text-sm text-gray-600">
              A modern hub for Roblox Studio creators to share, discover, and
              build together.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/store" className="text-gray-600 hover:text-primary">
                  Store
                </Link>
              </li>
              <li>
                <Link href="/assets" className="text-gray-600 hover:text-primary">
                  Assets
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              {socials.discord && (
                <li>
                  <a
                    href={socials.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary"
                  >
                    Discord
                  </a>
                </li>
              )}
              {socials.whatsapp && (
                <li>
                  <a
                    href={socials.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              {socials.youtube && (
                <li>
                  <a
                    href={socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary"
                  >
                    YouTube
                  </a>
                </li>
              )}
              {socials.x && (
                <li>
                  <a
                    href={socials.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary"
                  >
                    X (Twitter)
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-gray-600 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Roblox Studio Community. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
