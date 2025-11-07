"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SettingsFormProps {
  settings: any;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    siteName: settings.siteName || "",
    logoUrl: settings.logoUrl || "",
    heroTitle: settings.heroTitle || "",
    heroSubtitle: settings.heroSubtitle || "",
    primaryColor: settings.primaryColor || "#2563EB",
    featuredProductIds: JSON.parse(settings.featuredProductIds || "[]").join(","),
    featuredAssetIds: JSON.parse(settings.featuredAssetIds || "[]").join(","),
    discord: JSON.parse(settings.socials || "{}").discord || "",
    whatsapp: JSON.parse(settings.socials || "{}").whatsapp || "",
    youtube: JSON.parse(settings.socials || "{}").youtube || "",
    x: JSON.parse(settings.socials || "{}").x || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          featuredProductIds: formData.featuredProductIds.split(",").map((s) => s.trim()).filter(Boolean),
          featuredAssetIds: formData.featuredAssetIds.split(",").map((s) => s.trim()).filter(Boolean),
          socials: {
            discord: formData.discord || undefined,
            whatsapp: formData.whatsapp || undefined,
            youtube: formData.youtube || undefined,
            x: formData.x || undefined,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update settings");
      }

      router.refresh();
      alert("Settings updated successfully!");
    } catch (error) {
      alert("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Site Name</label>
        <input
          type="text"
          required
          value={formData.siteName}
          onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Logo URL</label>
        <input
          type="text"
          value={formData.logoUrl}
          onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Hero Title</label>
        <input
          type="text"
          required
          value={formData.heroTitle}
          onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Hero Subtitle</label>
        <input
          type="text"
          required
          value={formData.heroSubtitle}
          onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Primary Color</label>
        <input
          type="color"
          value={formData.primaryColor}
          onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
          className="w-full h-10 border border-neutral-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Featured Product IDs (comma-separated)</label>
        <input
          type="text"
          value={formData.featuredProductIds}
          onChange={(e) => setFormData({ ...formData, featuredProductIds: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Featured Asset IDs (comma-separated)</label>
        <input
          type="text"
          value={formData.featuredAssetIds}
          onChange={(e) => setFormData({ ...formData, featuredAssetIds: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
        />
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Social Links</h2>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Discord</label>
        <input
          type="url"
          value={formData.discord}
          onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">WhatsApp</label>
        <input
          type="url"
          value={formData.whatsapp}
          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">YouTube</label>
        <input
          type="url"
          value={formData.youtube}
          onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">X (Twitter)</label>
        <input
          type="url"
          value={formData.x}
          onChange={(e) => setFormData({ ...formData, x: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
