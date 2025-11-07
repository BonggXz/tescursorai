import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-neutral-900 mb-4">404</h1>
          <p className="text-xl text-neutral-600 mb-8">Page not found</p>
          <Link href="/" className="btn-primary inline-flex items-center space-x-2">
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
