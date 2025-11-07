import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ProductForm } from "@/components/admin/product-form";

async function getProduct(id: string) {
  return await prisma.product.findUnique({
    where: { id },
  });
}

export default async function AdminProductEditPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4 max-w-4xl">
          <h1 className="mb-8 text-4xl font-bold">Edit Product</h1>
          <ProductForm product={product} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
