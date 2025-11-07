import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";

import { AssetCard } from "@/components/cards/asset-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MdxContent } from "@/components/mdx/mdx-content";
import { formatFileSize } from "@/lib/format";
import { getAssetBySlug, getAssets } from "@/server/queries/assets";

type AssetPageProps = {
  params: { slug: string };
};

export default async function AssetPage({ params }: AssetPageProps) {
  const asset = await getAssetBySlug(params.slug);

  if (!asset) {
    notFound();
  }

  const relatedCategory = asset.categories[0];
  const relatedAssets = relatedCategory
    ? (await getAssets({ category: relatedCategory, perPage: 3 })).items.filter(
        (item) => item.id !== asset.id,
      )
    : [];

  return (
    <div className="container space-y-12 py-12">
      <Link
        href="/assets"
        className="inline-flex items-center text-sm font-medium text-slate-600 transition hover:text-slate-900"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to assets
      </Link>

      <header className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {asset.categories.map((category) => (
            <Badge key={category} variant="secondary">
              {category}
            </Badge>
          ))}
          <Badge variant="outline">{asset.license}</Badge>
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">{asset.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <span>Version {asset.version}</span>
          <span>Downloads {asset.downloadCount.toLocaleString()}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {asset.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </header>

      <section className="grid gap-10 md:grid-cols-[2fr_1fr]">
        <article className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">Overview</h2>
          <MdxContent source={asset.description} className="prose-lg" />
        </article>
        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Download package</h3>
            <p className="mt-2 text-sm text-slate-600">
              Downloads are rate limited and logged with IP and user agent to keep the community
              secure.
            </p>
            <Button asChild className="mt-4 w-full">
              <Link href={`/api/assets/${asset.id}/download`}>
                <Download className="mr-2 h-4 w-4" />
                Download asset
              </Link>
            </Button>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Included files
            </h3>
            <div className="space-y-3">
              {asset.files.map((file) => (
                <div key={file.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-900">{file.name}</p>
                  <p className="text-xs text-slate-500">
                    {file.ext.toUpperCase()} · {formatFileSize(file.size)}
                  </p>
                  <p className="mt-2 truncate font-mono text-[11px] text-slate-500">
                    {file.sha256}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {relatedAssets.length > 0 ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">More in {relatedCategory}</h2>
            <Link
              href={`/assets?category=${encodeURIComponent(relatedCategory ?? "")}`}
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedAssets.map((item) => (
              <AssetCard key={item.id} asset={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
