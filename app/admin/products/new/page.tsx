"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    priceCents: "",
    robloxAssetId: "",
    categories: "",
    tags: "",
    status: "DRAFT",
    images: "",
  });

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
          categories: formData.categories.split(",").map((s) => s.trim()).filter(Boolean),
          tags: formData.tags.split(",").map((s) => s.trim()).filter(Boolean),
          images: formData.images.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      router.push("/admin/products");
    } catch (error) {
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center space-x-2 text-neutral-600 hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-neutral-900">New Product</h1>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Slug</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
            <textarea
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Price ($)</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.priceCents}
              onChange={(e) => setFormData({ ...formData, priceCents: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Roblox Asset ID (optional)</label>
            <input
              type="text"
              value={formData.robloxAssetId}
              onChange={(e) => setFormData({ ...formData, robloxAssetId: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Categories (comma-separated)</label>
            <input
              type="text"
              value={formData.categories}
              onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Image URLs (comma-separated)</label>
            <input
              type="text"
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Creating..." : "Create Product"}
            </button>
            <Link href="/admin/products" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
