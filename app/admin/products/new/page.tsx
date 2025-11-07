"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    priceCents: "",
    robloxAssetId: "",
    status: "DRAFT",
    images: [] as string[],
    tags: [] as string[],
    categories: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          priceCents: parseInt(formData.priceCents) * 100,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create product");
      }

      router.push("/admin/products");
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
      <h1 className="text-3xl font-bold mb-8">New Product</h1>
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Create a new product for the store</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (!formData.slug) {
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, ""),
                    });
                  }
                }}
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
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                disabled={loading}
                className="w-full min-h-[200px] px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <Label htmlFor="priceCents">Price (USD) *</Label>
              <Input
                id="priceCents"
                type="number"
                step="0.01"
                value={formData.priceCents}
                onChange={(e) =>
                  setFormData({ ...formData, priceCents: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="robloxAssetId">Roblox Asset ID</Label>
              <Input
                id="robloxAssetId"
                value={formData.robloxAssetId}
                onChange={(e) =>
                  setFormData({ ...formData, robloxAssetId: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
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
                {loading ? "Creating..." : "Create Product"}
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
