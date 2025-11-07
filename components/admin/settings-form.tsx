"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteSettings } from "@prisma/client";
import { parseJson } from "@/lib/utils";

export function SettingsForm({ settings }: { settings: SiteSettings | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("site");

  const [siteData, setSiteData] = useState({
    siteName: settings?.siteName || "",
    logoUrl: settings?.logoUrl || "",
    heroTitle: settings?.heroTitle || "",
    heroSubtitle: settings?.heroSubtitle || "",
    primaryColor: settings?.primaryColor || "",
  });

  const [socialData, setSocialData] = useState(
    settings
      ? parseJson<Record<string, string>>(settings.socials, {})
      : {
          discord: "",
          whatsapp: "",
          youtube: "",
          x: "",
        }
  );

  const handleSiteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "site",
          data: siteData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update settings");
      }

      alert("Settings updated!");
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "social",
          data: socialData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update settings");
      }

      alert("Social links updated!");
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="site">Site Settings</TabsTrigger>
        <TabsTrigger value="social">Social Links</TabsTrigger>
      </TabsList>

      <TabsContent value="site">
        <Card>
          <CardHeader>
            <CardTitle>Site Settings</CardTitle>
            <CardDescription>Configure site branding and content</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSiteSubmit} className="space-y-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={siteData.siteName}
                  onChange={(e) =>
                    setSiteData({ ...siteData, siteName: e.target.value })
                  }
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  value={siteData.logoUrl}
                  onChange={(e) =>
                    setSiteData({ ...siteData, logoUrl: e.target.value })
                  }
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="heroTitle">Hero Title</Label>
                <Input
                  id="heroTitle"
                  value={siteData.heroTitle}
                  onChange={(e) =>
                    setSiteData({ ...siteData, heroTitle: e.target.value })
                  }
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                <Input
                  id="heroSubtitle"
                  value={siteData.heroSubtitle}
                  onChange={(e) =>
                    setSiteData({ ...siteData, heroSubtitle: e.target.value })
                  }
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Input
                  id="primaryColor"
                  value={siteData.primaryColor}
                  onChange={(e) =>
                    setSiteData({ ...siteData, primaryColor: e.target.value })
                  }
                  disabled={loading}
                  placeholder="#2563EB"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Settings"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="social">
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Configure community social media links</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSocialSubmit} className="space-y-4">
              <div>
                <Label htmlFor="discord">Discord URL</Label>
                <Input
                  id="discord"
                  type="url"
                  value={socialData.discord || ""}
                  onChange={(e) =>
                    setSocialData({ ...socialData, discord: e.target.value })
                  }
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp URL</Label>
                <Input
                  id="whatsapp"
                  type="url"
                  value={socialData.whatsapp || ""}
                  onChange={(e) =>
                    setSocialData({ ...socialData, whatsapp: e.target.value })
                  }
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="youtube">YouTube URL</Label>
                <Input
                  id="youtube"
                  type="url"
                  value={socialData.youtube || ""}
                  onChange={(e) =>
                    setSocialData({ ...socialData, youtube: e.target.value })
                  }
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="x">X (Twitter) URL</Label>
                <Input
                  id="x"
                  type="url"
                  value={socialData.x || ""}
                  onChange={(e) =>
                    setSocialData({ ...socialData, x: e.target.value })
                  }
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Social Links"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
