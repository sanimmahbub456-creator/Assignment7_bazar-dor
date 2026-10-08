"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/types/product";

type SortOption = "default" | "asc" | "desc";

interface CategoryProductListProps {
  products: Product[];
  categoryName: string;
}

export default function CategoryProductList({
  products,
  categoryName,
}: CategoryProductListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sortBy === "asc") {
      result.sort((a, b) => a.today - b.today);
    } else if (sortBy === "desc") {
      result.sort((a, b) => b.today - a.today);
    }

    return result;
  }, [products, sortBy]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold">
            {categoryName} পণ্যের তালিকা
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            মোট {products.length}টি পণ্য
          </p>
        </div>

        <div className="w-full sm:w-64">
          <label
            htmlFor="price-sort"
            className="mb-2 block text-sm font-medium"
          >
            পণ্য সাজান
          </label>

          <select
            id="price-sort"
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as SortOption)
            }
            className="select select-bordered w-full"
          >
            <option value="default">ডিফল্ট</option>
            <option value="asc">দাম: কম থেকে বেশি</option>
            <option value="desc">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      {sortedProducts.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-base-200 px-6 py-16 text-center">
          <div className="text-5xl">🛒</div>

          <h3 className="mt-4 text-xl font-bold">
            এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি
          </h3>

          <p className="mt-2 text-gray-500">
            অন্য ক্যাটাগরি থেকে পণ্য দেখুন।
          </p>
        </div>
      )}
    </section>
  );
}