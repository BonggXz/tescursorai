import Link from "next/link";
import { Download, FileCode2, Tag } from "lucide-react";

import { AssetSummary } from "@/server/assets";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AssetCardProps = {
  asset: AssetSummary;
};

export function AssetCard({ asset }: AssetCardProps) {
  return (
    <article className="group flex flex-col justify-between rounded-3xl border border-border/70 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileCode2 className="h-4 w-4 text-primary" aria-hidden />
          <span>v{asset.version}</span>
          <span>&middot;</span>
          <span>{asset.license}</span>
        </div>
        <Link
          href={`/assets/${asset.slug}`}
          className="text-lg font-semibold text-slate-900 transition hover:text-primary"
        >
          {asset.title}
        </Link>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {asset.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {asset.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              <Tag className="mr-1 h-3 w-3" aria-hidden />
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4">
        <div className="text-xs text-muted-foreground">
          <span className="font-medium text-slate-900">{asset.downloadCount}</span>{" "}
          downloads &middot; Updated {formatDate(asset.updatedAt)}
        </div>
        <Link
          href={`/assets/${asset.slug}`}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "group/cta text-sm",
          )}
        >
          Download
          <Download className="ml-1 h-4 w-4 transition group-hover/cta:translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}
