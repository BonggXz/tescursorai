import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Roblox Studio Community</h3>
            <p className="text-sm text-neutral-600">
              A modern hub for Roblox Studio creators to share, learn, and build together.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/store" className="text-neutral-600 hover:text-neutral-900">
                  Store
                </Link>
              </li>
              <li>
                <Link href="/assets" className="text-neutral-600 hover:text-neutral-900">
                  Assets
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-neutral-600 hover:text-neutral-900">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-600 hover:text-neutral-900">
                  API Reference
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://discord.gg/robloxstudio" className="text-neutral-600 hover:text-neutral-900">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-600 hover:text-neutral-900">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-neutral-200 pt-8 text-center text-sm text-neutral-600">
          <p>&copy; {new Date().getFullYear()} Roblox Studio Community. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
