import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  await requireAdmin();

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  if (!settings) {
    // Create default settings if they don't exist
    await prisma.siteSettings.create({
      data: {
        id: "singleton",
      },
    });
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Site Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
