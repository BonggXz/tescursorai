import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, FileText, ShieldCheck } from "lucide-react";

import { getAssetBySlug, getRelatedAssets } from "@/server/assets";
import { MdxContent } from "@/components/mdx/mdx-content";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBytes, formatDate } from "@/lib/format";
import { AssetCard } from "@/components/assets/asset-card";

type AssetDetailPageProps = {
  params: { slug: string };
};

export default async function AssetDetailPage({ params }: AssetDetailPageProps) {
  const asset = await getAssetBySlug(params.slug);
  if (!asset) {
    notFound();
  }

  const related = await getRelatedAssets(asset, 3);

  return (
    <div className="container flex flex-col gap-16 py-16">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_1.2fr]">
        <div className="space-y-6 rounded-3xl border border-border/70 bg-white p-8 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Asset
              </p>
              <h1 className="mt-2 text-3xl font-heading font-semibold text-slate-900">
                {asset.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                Version {asset.version} &middot; Updated {formatDate(asset.updatedAt)}
              </p>
            </div>
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
              {asset.license}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {asset.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="rounded-full px-3 py-1 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <MdxContent code={asset.description} />
        </div>
        <aside className="flex flex-col gap-6 rounded-3xl border border-border/70 bg-white p-8 shadow-lg">
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2 font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" /> Free community asset
            </p>
            <p className="mt-2">
              Downloads are rate limited per IP and user account. Each download is logged
              for auditing and analytics.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Files included
            </h2>
            <ul className="space-y-3">
              {asset.files.map((file) => (
                <li
                  key={file.id}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-border/60 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium text-slate-900">
                      <FileText className="h-4 w-4 text-primary" />
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {file.ext.toUpperCase()} &middot; {formatBytes(file.size)}
                    </p>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="rounded-full text-xs"
                  >
                    <a href={`/api/assets/${asset.id}/download?fileId=${file.id}`}>
                      <Download className="mr-1 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-slate-50 px-4 py-3 text-sm text-muted-foreground">
            <div>
              <span className="text-lg font-semibold text-slate-900">
                {asset.downloadCount}
              </span>{" "}
              total downloads
            </div>
            <Button
              asChild
              variant="default"
              size="sm"
              className="rounded-full bg-primary text-primary-foreground shadow-subtle"
            >
              <a href={`/api/assets/${asset.id}/download`}>
                <Download className="mr-1 h-4 w-4" />
                Download latest
              </a>
            </Button>
          </div>
        </aside>
      </section>

      {related.length > 0 ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-heading font-semibold text-slate-900">
              More assets to explore
            </h2>
            <Link
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              href="/assets"
            >
              Browse library
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => (
              <AssetCard key={item.id} asset={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
