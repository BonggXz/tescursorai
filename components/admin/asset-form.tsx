"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

interface AssetFormProps {
  asset?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    version: string;
    files: string;
    categories: string;
    tags: string;
    license: string;
    status: string;
  };
}

export function AssetForm({ asset }: AssetFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: asset?.title || "",
    slug: asset?.slug || "",
    description: asset?.description || "",
    version: asset?.version || "1.0.0",
    license: asset?.license || "MIT",
    categories: asset ? JSON.parse(asset.categories || "[]").join(", ") : "",
    tags: asset ? JSON.parse(asset.tags || "[]").join(", ") : "",
    status: asset?.status || "DRAFT",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        categories: formData.categories.split(",").map((s: string) => s.trim()).filter(Boolean),
        tags: formData.tags.split(",").map((s: string) => s.trim()).filter(Boolean),
        files: asset ? JSON.parse(asset.files || "[]") : [],
      };

      if (asset) {
        await fetch(`/api/assets/${asset.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        await fetch("/api/assets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      router.push("/admin/assets");
      router.refresh();
    } catch (error) {
      console.error("Error saving asset:", error);
      alert("Failed to save asset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{asset ? "Edit Asset" : "Create Asset"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description (MDX)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={10}
            />
          </div>
          <div>
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="license">License</Label>
            <Input
              id="license"
              value={formData.license}
              onChange={(e) => setFormData({ ...formData, license: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="categories">Categories (comma-separated)</Label>
            <Input
              id="categories"
              value={formData.categories}
              onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : asset ? "Update Asset" : "Create Asset"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
