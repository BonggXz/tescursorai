import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '@/components/header'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Roblox Studio Community',
  description: 'A modern hub for Roblox Studio creators',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          <footer className="border-t bg-slate-50">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Roblox Studio Community</h3>
                  <p className="text-sm text-muted-foreground">
                    A modern hub for Roblox Studio creators to share and discover amazing content.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Resources</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link href="/store" className="text-muted-foreground hover:text-foreground">
                        Store
                      </Link>
                    </li>
                    <li>
                      <Link href="/assets" className="text-muted-foreground hover:text-foreground">
                        Free Assets
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Support</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="https://discord.gg/roblox" className="text-muted-foreground hover:text-foreground">
                        Discord
                      </a>
                    </li>
                    <li>
                      <a href="mailto:support@robloxcommunity.com" className="text-muted-foreground hover:text-foreground">
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <span className="text-muted-foreground">Terms of Service</span>
                    </li>
                    <li>
                      <span className="text-muted-foreground">Privacy Policy</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Roblox Studio Community. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
        <Toaster />
        </Providers>
      </body>
    </html>
  )
}
