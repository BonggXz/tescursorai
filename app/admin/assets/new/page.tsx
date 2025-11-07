import { requireAdmin } from "@/lib/auth-helpers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AssetForm } from "@/components/admin/asset-form";

export default async function AdminAssetNewPage() {
  await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4 max-w-4xl">
          <h1 className="mb-8 text-4xl font-bold">New Asset</h1>
          <AssetForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
