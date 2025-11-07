import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AssetDto } from "@/lib/services/assets";
import { Download } from "lucide-react";

interface AssetCardProps {
  asset: AssetDto;
}

export function AssetCard({ asset }: AssetCardProps) {
  return (
    <Link href={`/assets/${asset.slug}`} className="group block">
      <Card className="card-hover h-full transition">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {asset.categories.slice(0, 2).map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>
          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary">
            {asset.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            Version {asset.version} · License {asset.license}
          </p>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {asset.description}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Download className="h-4 w-4" />
            <span>{asset.downloadCount} downloads</span>
          </div>
          <Button variant="secondary" size="sm">
            View asset
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
