import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getCategories,
  getProductsByCategory,
} from "@/lib/api";

import CategoryProductList from "@/components/products/CategoryProductList";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProductsByCategory(slug),
  ]);

  const category = categories.find(
    (item) => item.slug === slug || item.id === slug,
  );

  if (!category || products.length === 0) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-base-200/40 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-base-content/60 hover:text-primary"
        >
          ← হোম পেজে ফিরে যান
        </Link>

        <section className="rounded-3xl border border-base-300 bg-base-100 p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-base-200 text-4xl">
              {category.icon || "🛒"}
            </div>

            <div>
              <h1 className="text-2xl font-bold md:text-3xl">
                {category.nameBn}
              </h1>

              <p className="mt-1 text-sm text-base-content/60">
                এই ক্যাটাগরির {products.length.toLocaleString("bn-BD")}টি পণ্য
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <CategoryProductList products={products} />
        </section>
      </div>
    </main>
  );
}