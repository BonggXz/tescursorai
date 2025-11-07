"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Upload } from "lucide-react";
import { parseJson } from "@/lib/utils";
import { Asset } from "@prisma/client";

export function EditAssetForm({ asset }: { asset: Asset }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: asset.title,
    slug: asset.slug,
    description: asset.description,
    version: asset.version,
    license: asset.license,
    status: asset.status,
    tags: parseJson<string[]>(asset.tags, []),
    categories: parseJson<string[]>(asset.categories, []),
  });
  const [tagInput, setTagInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      alert(`File uploaded: ${data.name}`);
    } catch (error) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/assets/${asset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update asset");
      }

      router.push("/admin/assets");
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const addCategory = () => {
    if (
      categoryInput.trim() &&
      !formData.categories.includes(categoryInput.trim())
    ) {
      setFormData({
        ...formData,
        categories: [...formData.categories, categoryInput.trim()],
      });
      setCategoryInput("");
    }
  };

  const removeCategory = (cat: string) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter((c) => c !== c),
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Asset</h1>
      <Card>
        <CardHeader>
          <CardTitle>Asset Details</CardTitle>
          <CardDescription>Update asset information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="description">Description (MDX) *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                disabled={loading}
                className="w-full min-h-[300px] px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) =>
                    setFormData({ ...formData, version: e.target.value })
                  }
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="license">License</Label>
                <Input
                  id="license"
                  value={formData.license}
                  onChange={(e) =>
                    setFormData({ ...formData, license: e.target.value })
                  }
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <Label>File Upload</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload .lua, .rbxm, or .rbxmx files
                </p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading || loading}
                  accept=".lua,.rbxm,.rbxmx"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button type="button" variant="outline" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
                {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
              </div>
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add tag"
                  disabled={loading}
                />
                <Button type="button" onClick={addTag} disabled={loading}>
                  Add
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Categories</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCategory();
                    }
                  }}
                  placeholder="Add category"
                  disabled={loading}
                />
                <Button type="button" onClick={addCategory} disabled={loading}>
                  Add
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {formData.categories.map((cat) => (
                  <Badge key={cat} variant="outline" className="flex items-center gap-1">
                    {cat}
                    <button
                      type="button"
                      onClick={() => removeCategory(cat)}
                      className="ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Asset"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
