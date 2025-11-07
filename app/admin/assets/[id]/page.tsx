import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditAssetForm } from "@/components/admin/edit-asset-form";

export default async function EditAssetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const asset = await prisma.asset.findUnique({
    where: { id },
  });

  if (!asset) {
    notFound();
  }

  return <EditAssetForm asset={asset} />;
}
