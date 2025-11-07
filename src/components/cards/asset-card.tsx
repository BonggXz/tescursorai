import Link from "next/link";
import { Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getExcerpt } from "@/lib/markdown";

type AssetFile = {
  id: string;
  url: string;
  name: string;
  ext: string;
  size: number;
};

type Asset = {
  id: string;
  slug: string;
  title: string;
  description: string;
  version: string;
  license: string;
  categories: string[];
  tags: string[];
  downloadCount: number;
  files: AssetFile[];
};

type AssetCardProps = {
  asset: Asset;
  className?: string;
};

export function AssetCard({ asset, className }: AssetCardProps) {
  return (
    <Card className={cn("flex h-full flex-col border border-slate-200", className)}>
      <CardHeader className="flex items-start justify-between space-y-0 border-b border-slate-200 bg-slate-50 p-5">
        <div>
          <Link
            href={`/assets/${asset.slug}`}
            className="text-lg font-semibold text-slate-900 hover:underline"
          >
            {asset.title}
          </Link>
          <p className="text-xs text-slate-500">Version {asset.version}</p>
        </div>
        <Badge variant="secondary">{asset.license}</Badge>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <p className="line-clamp-3 text-sm text-slate-600">{getExcerpt(asset.description)}</p>
        <div className="flex flex-wrap gap-2">
          {asset.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-slate-200 bg-white px-5 py-4 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Download className="h-4 w-4 text-primary" />
          <span>{asset.downloadCount.toLocaleString()} downloads</span>
        </div>
        <Link
          href={`/assets/${asset.slug}`}
          className="font-medium text-primary hover:text-primary/80"
        >
          View asset →
        </Link>
      </CardFooter>
    </Card>
  );
}
