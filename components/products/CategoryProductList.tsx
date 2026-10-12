"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import type { Product } from "@/types/product";

interface CategoryProductListProps {
  products: Product[];
}

type SortOption = "default" | "price-asc" | "price-desc";

const unitLabels: Record<string, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

function formatPrice(price: number) {
  return `৳${new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(price)}`;
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-base-300 bg-base-100 p-4">
      <div className="flex h-24 items-center justify-center rounded-xl bg-base-200">
        <div className="h-12 w-12 rounded-xl bg-base-300" />
      </div>

      <div className="mt-4 h-4 w-3/4 rounded bg-base-300" />
      <div className="mt-3 h-3 w-1/2 rounded bg-base-200" />
      <div className="mt-5 h-6 w-2/3 rounded bg-base-300" />
      <div className="mt-4 h-9 rounded-lg bg-base-200" />
    </div>
  );
}

function ChangeBadge({ product }: { product: Product }) {
  const direction = product.change?.dir;
  const percentage = product.change?.pct ?? 0;

  const classes =
    direction === "up"
      ? "bg-error/10 text-error"
      : direction === "down"
        ? "bg-success/10 text-success"
        : "bg-base-200 text-base-content/60";

  const symbol =
    direction === "up" ? "↑" : direction === "down" ? "↓" : "•";

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${classes}`}>
      {symbol} {percentage}%
    </span>
  );
}

export default function CategoryProductList({
  products,
}: CategoryProductListProps) {
  const [sort, setSort] = useState<SortOption>("default");
  const [loading, setLoading] = useState(false);

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sort === "price-asc") {
      result.sort((a, b) => a.today - b.today);
    } else if (sort === "price-desc") {
      result.sort((a, b) => b.today - a.today);
    }

    return result;
  }, [products, sort]);

  function handleSort(value: SortOption) {
    setLoading(true);
    setSort(value);

    // Sorting is local; no new API request is needed.
    setLoading(false);
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-base-300 bg-base-100 px-6 py-12 text-center">
        <div className="text-4xl">🛒</div>

        <h2 className="mt-4 text-xl font-bold">
          কোনো পণ্য পাওয়া যায়নি
        </h2>

        <p className="mt-2 text-sm text-base-content/60">
          এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই।
        </p>

        <Link href="/" className="btn btn-primary mt-6">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-sm text-base-content/60">
          মোট {sortedProducts.length.toLocaleString("bn-BD")}টি পণ্য
        </p>

        <label className="flex items-center gap-3 text-sm">
          <span className="shrink-0 font-medium">সাজান:</span>

          <select
            value={sort}
            onChange={(event) =>
              handleSort(event.target.value as SortOption)
            }
            className="select select-bordered w-full sm:w-56"
          >
            <option value="default">ডিফল্ট</option>
            <option value="price-asc">দাম: কম থেকে বেশি</option>
            <option value="price-desc">দাম: বেশি থেকে কম</option>
          </select>
        </label>
      </div>

      {loading ? (
        <>
          <p className="mb-4 text-sm text-base-content/60">
            Loading…
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {sortedProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group rounded-2xl border border-base-300 bg-base-100 p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-4"
            >
              <div className="flex h-24 items-center justify-center rounded-xl bg-base-200 text-5xl transition group-hover:bg-primary/10">
                {product.image || product.categoryIcon || "🛒"}
              </div>

              <div className="mt-4 flex min-h-10 items-start justify-between gap-2">
                <h2 className="font-bold leading-5">
                  {product.nameBn}
                </h2>

                <ChangeBadge product={product} />
              </div>

              <p className="mt-2 text-xs text-base-content/60">
                {unitLabels[product.unit] || "প্রতি একক"}
              </p>

              <p className="mt-3 text-xl font-bold text-primary">
                {formatPrice(product.today)}
              </p>

              <p className="mt-1 text-xs text-base-content/50">
                আজকের রেফারেন্স মূল্য
              </p>

              <div className="mt-4 rounded-lg border border-base-300 px-3 py-2 text-center text-sm font-medium transition group-hover:border-primary group-hover:text-primary">
                বিস্তারিত দেখুন →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}