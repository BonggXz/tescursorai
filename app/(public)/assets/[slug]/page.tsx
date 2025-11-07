import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MDXContent } from "@/components/content/mdx-content";
import { AssetCard } from "@/components/assets/asset-card";
import {
  getAssetBySlug,
  getLatestAssets,
  type AssetDto,
} from "@/lib/services/assets";

interface AssetPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: AssetPageProps): Promise<Metadata> {
  const asset = await getAssetBySlug(params.slug);
  if (!asset) {
    return {
      title: "Asset not found",
    };
  }

  return {
    title: asset.title,
    description: asset.description.slice(0, 160),
  };
}

export default async function AssetDetailPage({ params }: AssetPageProps) {
  const asset = await getAssetBySlug(params.slug);

  if (!asset) {
    notFound();
  }

  const related = await getLatestAssets(6);
  const otherAssets = related.filter((item) => item.id !== asset.id).slice(0, 3);

  return (
    <div className="bg-white py-12 md:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-4">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] text-primary">
                Roblox asset
              </p>
              <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
                {asset.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                {asset.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Version {asset.version} · License {asset.license}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                Download bundle
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Includes {asset.files.length} file
                {asset.files.length === 1 ? "" : "s"} with integrity-checked
                hashes.
              </p>
              <div className="mt-4 space-y-3">
                {asset.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.ext.toUpperCase()} · {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      SHA-256: {file.sha256.slice(0, 10)}…
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{asset.downloadCount.toLocaleString()} downloads</span>
                <span>
                  Updated{" "}
                  {asset.updatedAt.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <Button
                asChild
                className="btn-primary mt-6 w-full"
                size="lg"
              >
                <a href={`/api/assets/${asset.id}/download`}>Download .zip</a>
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Changelog
            </h2>
            <Separator className="my-4" />
            <MDXContent source={asset.description} />
          </div>
        </div>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Explore more assets
            </h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/assets">Browse library</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherAssets.map((item: AssetDto) => (
              <AssetCard key={item.id} asset={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
