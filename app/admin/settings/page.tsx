import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/SettingsForm";

async function getSettings() {
  let settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {},
    });
  }

  return settings;
}

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSettings();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-neutral-900">Site Settings</h1>
        <SettingsForm settings={settings} />
      </main>
      <Footer />
    </div>
  );
}
