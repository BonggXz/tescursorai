import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

async function getSettings() {
  return await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });
}

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSettings();
  const socials = settings?.socials ? JSON.parse(settings.socials) : {};

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4 max-w-4xl">
          <h1 className="mb-8 text-4xl font-bold">Settings</h1>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>Configure site name, logo, and hero content</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input id="siteName" defaultValue={settings?.siteName || ""} />
                  </div>
                  <div>
                    <Label htmlFor="heroTitle">Hero Title</Label>
                    <Input id="heroTitle" defaultValue={settings?.heroTitle || ""} />
                  </div>
                  <div>
                    <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                    <Textarea id="heroSubtitle" defaultValue={settings?.heroSubtitle || ""} />
                  </div>
                  <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input id="logoUrl" defaultValue={settings?.logoUrl || ""} />
                  </div>
                  <Button type="submit">Save Site Settings</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Configure community social media links</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="discord">Discord</Label>
                    <Input id="discord" defaultValue={socials.discord || ""} />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input id="whatsapp" defaultValue={socials.whatsapp || ""} />
                  </div>
                  <div>
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input id="youtube" defaultValue={socials.youtube || ""} />
                  </div>
                  <div>
                    <Label htmlFor="x">X (Twitter)</Label>
                    <Input id="x" defaultValue={socials.x || ""} />
                  </div>
                  <Button type="submit">Save Social Links</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
