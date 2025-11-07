import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { inter, spaceGrotesk } from "@/lib/fonts";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";

export const metadata: Metadata = {
  title: {
    default: "Roblox Studio Community Hub",
    template: "%s | Roblox Studio Community Hub",
  },
  description:
    "Build together and share faster with a modern Roblox Studio creator community.",
  metadataBase: new URL("https://example.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased",
          inter.variable,
          spaceGrotesk.variable,
        )}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
