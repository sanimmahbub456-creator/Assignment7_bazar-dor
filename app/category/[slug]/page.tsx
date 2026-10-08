import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getProducts, getCategories } from "@/lib/api";
import type { Product } from "@/types/product";
import CategoryProductList from "@/components/products/CategoryProductList";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface Category {
  slug: string;
  nameBn?: string;
  category?: string;
}

const categoryNames: Record<string, string> = {
  chal: "চাল",
  dal: "ডাল",
  tel: "তেল",
  sobji: "সবজি",
  mach: "মাছ",
  mangsho: "মাংস",
  "dim-dui": "ডিম ও দুগ্ধজাত পণ্য",
  mosla: "মসলা",
};

const categoryIcons: Record<string, string> = {
  chal: "🍚",
  dal: "🫘",
  tel: "🫗",
  sobji: "🥬",
  mach: "🐟",
  mangsho: "🍖",
  "dim-dui": "🥚",
  mosla: "🌶️",
};

export default function CategoryPage({
  params,
}: CategoryPageProps) {
  return (
    <Suspense fallback={<CategoryLoading />}>
      <CategoryPageContent params={params} />
    </Suspense>
  );
}

async function CategoryPageContent({
  params,
}: CategoryPageProps) {
  const { slug } = await params;

  const [productsResponse, categoriesResponse] =
    await Promise.all([
      getProducts(),
      getCategories(),
    ]);

  const products: Product[] = Array.isArray(productsResponse)
    ? productsResponse
    : productsResponse?.products ?? [];

  const categories: Category[] = Array.isArray(
    categoriesResponse
  )
    ? categoriesResponse
    : categoriesResponse?.categories ?? [];

  const categoryExists =
    categories.some(
      (category) =>
        category.slug === slug ||
        category.category === slug
    ) ||
    products.some(
      (product) => product.category === slug
    );

  if (!categoryExists) {
    notFound();
  }

  const categoryProducts = products.filter(
    (product) => product.category === slug
  );

  const categoryName =
    categoryNames[slug] ||
    categories.find(
      (category) =>
        category.slug === slug ||
        category.category === slug
    )?.nameBn ||
    categoryProducts[0]?.categoryNameBn ||
    "পণ্য";

  const categoryIcon =
    categoryIcons[slug] ||
    categoryProducts[0]?.categoryIcon ||
    "🛒";

  return (
    <main className="min-h-screen">
      <section className="bg-base-200">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <Link
            href="/"
            className="text-sm text-primary hover:underline"
          >
            ← হোম পেজে ফিরে যান
          </Link>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-base-100 text-5xl shadow-sm">
              {categoryIcon}
            </div>

            <div>
              <h1 className="text-3xl font-black md:text-4xl">
                {categoryName}
              </h1>

              <p className="mt-2 text-gray-500">
                এই ক্যাটাগরির পণ্যের আজকের বাজারদর
              </p>
            </div>
          </div>
        </div>
      </section>

      <CategoryProductList
        products={categoryProducts}
        categoryName={categoryName}
      />
    </main>
  );
}

function CategoryLoading() {
  return (
    <main className="min-h-screen">
      <section className="bg-base-200">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="h-4 w-32 animate-pulse rounded bg-base-300" />

          <div className="mt-6 flex items-center gap-4">
            <div className="h-20 w-20 animate-pulse rounded-2xl bg-base-300" />

            <div>
              <div className="h-9 w-40 animate-pulse rounded bg-base-300" />
              <div className="mt-3 h-4 w-64 animate-pulse rounded bg-base-300" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="h-7 w-48 animate-pulse rounded bg-base-300" />
            <div className="mt-3 h-4 w-32 animate-pulse rounded bg-base-300" />
          </div>

          <div className="h-12 w-full animate-pulse rounded-lg bg-base-300 sm:w-64" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-base-200 p-5"
            >
              <div className="h-16 w-16 rounded-2xl bg-base-300" />
              <div className="mt-5 h-5 w-3/4 rounded bg-base-300" />
              <div className="mt-3 h-4 w-1/2 rounded bg-base-300" />
              <div className="mt-6 h-8 w-2/3 rounded bg-base-300" />
              <div className="mt-4 h-7 w-20 rounded-full bg-base-300" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}