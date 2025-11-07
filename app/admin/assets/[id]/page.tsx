import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AssetForm } from "@/components/admin/asset-form";

async function getAsset(id: string) {
  return await prisma.asset.findUnique({
    where: { id },
  });
}

export default async function AdminAssetEditPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const asset = await getAsset(params.id);

  if (!asset) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4 max-w-4xl">
          <h1 className="mb-8 text-4xl font-bold">Edit Asset</h1>
          <AssetForm asset={asset} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
