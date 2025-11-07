"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

interface ProductFormProps {
  product?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    priceCents: number;
    images: string;
    robloxAssetId?: string | null;
    categories: string;
    tags: string;
    status: string;
  };
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: product?.title || "",
    slug: product?.slug || "",
    description: product?.description || "",
    priceCents: product ? (product.priceCents / 100).toString() : "",
    robloxAssetId: product?.robloxAssetId || "",
    categories: product ? JSON.parse(product.categories || "[]").join(", ") : "",
    tags: product ? JSON.parse(product.tags || "[]").join(", ") : "",
    status: product?.status || "DRAFT",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        priceCents: Math.round(parseFloat(formData.priceCents) * 100),
        categories: formData.categories.split(",").map((s: string) => s.trim()).filter(Boolean),
        tags: formData.tags.split(",").map((s: string) => s.trim()).filter(Boolean),
        images: [],
      };

      if (product) {
        await fetch(`/api/products/${product.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Create Product"}</CardTitle>
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
            />
          </div>
          <div>
            <Label htmlFor="priceCents">Price ($)</Label>
            <Input
              id="priceCents"
              type="number"
              step="0.01"
              value={formData.priceCents}
              onChange={(e) => setFormData({ ...formData, priceCents: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="robloxAssetId">Roblox Asset ID</Label>
            <Input
              id="robloxAssetId"
              value={formData.robloxAssetId}
              onChange={(e) => setFormData({ ...formData, robloxAssetId: e.target.value })}
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
            {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
