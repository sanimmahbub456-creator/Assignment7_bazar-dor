import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getProducts } from "@/lib/api";
import type { Product } from "@/types/product";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const unitLabel: Record<Product["unit"], string> = {
  kg: "কেজি",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

function toBanglaNumber(value: number) {
  const digits = "০১২৩৪৫৬৭৮৯";

  return value
    .toString()
    .replace(/\d/g, (digit) => digits[Number(digit)]);
}

export default function ProductPage({
  params,
}: ProductPageProps) {
  return (
    <Suspense fallback={<ProductLoading />}>
      <ProductPageContent params={params} />
    </Suspense>
  );
}

async function ProductPageContent({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  // 🔐 Better Auth session check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // ❌ User is not logged in
  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-base-200 px-4">
        <div className="w-full max-w-md rounded-3xl bg-base-100 p-8 text-center shadow-sm">
          <div className="text-6xl">🔐</div>

          <h1 className="mt-5 text-2xl font-black">
            লগইন প্রয়োজন
          </h1>

          <p className="mt-3 leading-7 text-gray-500">
            পণ্যের বিস্তারিত তথ্য দেখতে আগে আপনার অ্যাকাউন্টে
            লগইন করুন।
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/sign-in"
              className="btn btn-primary"
            >
              সাইন ইন
            </Link>

            <Link
              href="/sign-up"
              className="btn btn-outline"
            >
              সাইন আপ
            </Link>
          </div>

          <Link
            href="/"
            className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  /*
   * The API's /products/:slug endpoint returns 404,
   * so we get all products and find the matching slug.
   */
  const productsResponse = await getProducts();

  const products: Product[] = Array.isArray(productsResponse)
    ? productsResponse
    : productsResponse?.products ?? [];

  const product =
    products.find((item) => item.slug === slug) ?? null;

  if (!product) {
    notFound();
  }

  const unit = unitLabel[product.unit];
  const marketPrices = product.markets ?? [];

  const minimumPrice =
    marketPrices.length > 0
      ? Math.min(
          ...marketPrices.map((market) => market.min)
        )
      : product.today;

  const maximumPrice =
    marketPrices.length > 0
      ? Math.max(
          ...marketPrices.map((market) => market.max)
        )
      : product.today;

  const averagePrice =
    marketPrices.length > 0
      ? Math.round(
          marketPrices.reduce(
            (total, market) =>
              total + (market.min + market.max) / 2,
            0
          ) / marketPrices.length
        )
      : product.today;

  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";
  const isFlat = product.change.dir === "flat";

  return (
    <main className="min-h-screen bg-base-200">
      {/* Breadcrumb / Back */}
      <section className="bg-base-100">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Link
            href="/"
            className="text-sm font-medium text-primary hover:underline"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </section>

      {/* Product Summary */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Product Information */}
          <div className="rounded-3xl bg-base-100 p-6 shadow-sm md:p-8 lg:col-span-2">
            <div className="flex flex-col gap-6 sm:flex-row">
              {/* Product Icon */}
              <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-3xl bg-base-200 text-7xl">
                {product.image}
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-base-200 px-3 py-1 text-xs font-medium">
                    {product.categoryIcon}{" "}
                    {product.categoryNameBn}
                  </span>

                  <span className="rounded-full bg-base-200 px-3 py-1 text-xs font-medium">
                    প্রতি {unit}
                  </span>
                </div>

                <h1 className="mt-4 text-3xl font-black md:text-4xl">
                  {product.nameBn}
                </h1>

                <p className="mt-2 text-gray-500">
                  আজকের বাজারদরের বিস্তারিত তথ্য
                </p>
              </div>
            </div>

            {/* Today's Price */}
            <div className="mt-10 rounded-2xl bg-base-200 p-6">
              <p className="text-sm text-gray-500">
                আজকের দাম
              </p>

              <div className="mt-2 flex flex-wrap items-end gap-3">
                <span className="text-4xl font-black md:text-5xl">
                  ৳{toBanglaNumber(product.today)}
                </span>

                <span className="mb-1 text-gray-500">
                  / {unit}
                </span>

                {isUp && (
                  <span className="mb-1 rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                    ▲ {toBanglaNumber(product.change.pct)}%
                  </span>
                )}

                {isDown && (
                  <span className="mb-1 rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                    ▼{" "}
                    {toBanglaNumber(
                      Math.abs(product.change.pct)
                    )}
                    %
                  </span>
                )}

                {isFlat && (
                  <span className="mb-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-bold text-gray-600">
                    — অপরিবর্তিত
                  </span>
                )}
              </div>
            </div>

            {/* Historical Prices */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <PriceBox
                label="গতকাল"
                price={product.yesterday}
                unit={unit}
              />

              <PriceBox
                label="গত সপ্তাহ"
                price={product.lastWeek}
                unit={unit}
              />

              <PriceBox
                label="গত মাস"
                price={product.lastMonth}
                unit={unit}
              />
            </div>
          </div>

          {/* Price Statistics */}
          <div className="rounded-3xl bg-base-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold">
              বাজারদরের পরিসর
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              বিভিন্ন বাজারের সর্বনিম্ন ও সর্বোচ্চ দাম
            </p>

            <div className="mt-6 space-y-4">
              <StatBox
                label="সর্বনিম্ন দাম"
                value={minimumPrice}
                unit={unit}
              />

              <StatBox
                label="সর্বোচ্চ দাম"
                value={maximumPrice}
                unit={unit}
              />

              <StatBox
                label="গড় দাম"
                value={averagePrice}
                unit={unit}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Market Prices */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl bg-base-100 p-6 shadow-sm md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-black">
              বাজারভিত্তিক দাম
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              বিভিন্ন বাজারে {product.nameBn}-এর বর্তমান দাম
            </p>
          </div>

          {marketPrices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="px-4 py-4">
                      বাজার
                    </th>

                    <th className="px-4 py-4">
                      বিভাগ
                    </th>

                    <th className="px-4 py-4">
                      সর্বনিম্ন
                    </th>

                    <th className="px-4 py-4">
                      সর্বোচ্চ
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {marketPrices.map((market, index) => (
                    <tr
                      key={`${market.market}-${index}`}
                      className="border-b last:border-0"
                    >
                      <td className="px-4 py-4 font-semibold">
                        {market.market}
                      </td>

                      <td className="px-4 py-4 text-gray-500">
                        {market.division}
                      </td>

                      <td className="px-4 py-4 font-semibold">
                        ৳{toBanglaNumber(market.min)}
                      </td>

                      <td className="px-4 py-4 font-semibold">
                        ৳{toBanglaNumber(market.max)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-2xl bg-base-200 p-8 text-center text-gray-500">
              বাজারভিত্তিক তথ্য বর্তমানে পাওয়া যাচ্ছে না।
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/* --------------------------------
   Historical Price Box
-------------------------------- */

function PriceBox({
  label,
  price,
  unit,
}: {
  label: string;
  price: number;
  unit: string;
}) {
  return (
    <div className="rounded-2xl border border-base-200 p-4">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold">
        ৳{toBanglaNumber(price)}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        / {unit}
      </p>
    </div>
  );
}

/* --------------------------------
   Statistics Box
-------------------------------- */

function StatBox({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="rounded-2xl bg-base-200 p-4">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black">
        ৳{toBanglaNumber(value)}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        / {unit}
      </p>
    </div>
  );
}

/* --------------------------------
   Loading Skeleton
-------------------------------- */

function ProductLoading() {
  return (
    <main className="min-h-screen bg-base-200">
      <section className="bg-base-100">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="h-4 w-32 animate-pulse rounded bg-base-300" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Skeleton */}
          <div className="rounded-3xl bg-base-100 p-8 lg:col-span-2">
            <div className="flex gap-6">
              <div className="h-32 w-32 animate-pulse rounded-3xl bg-base-300" />

              <div className="flex-1">
                <div className="h-6 w-24 animate-pulse rounded bg-base-300" />

                <div className="mt-5 h-10 w-64 animate-pulse rounded bg-base-300" />

                <div className="mt-3 h-4 w-48 animate-pulse rounded bg-base-300" />
              </div>
            </div>

            <div className="mt-10 h-32 animate-pulse rounded-2xl bg-base-300" />

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="h-24 animate-pulse rounded-2xl bg-base-300" />
              <div className="h-24 animate-pulse rounded-2xl bg-base-300" />
              <div className="h-24 animate-pulse rounded-2xl bg-base-300" />
            </div>
          </div>

          {/* Statistics Skeleton */}
          <div className="rounded-3xl bg-base-100 p-6">
            <div className="h-7 w-48 animate-pulse rounded bg-base-300" />

            <div className="mt-6 space-y-4">
              <div className="h-24 animate-pulse rounded-2xl bg-base-300" />

              <div className="h-24 animate-pulse rounded-2xl bg-base-300" />

              <div className="h-24 animate-pulse rounded-2xl bg-base-300" />
            </div>
          </div>
        </div>

        {/* Market Skeleton */}
        <div className="mt-8 rounded-3xl bg-base-100 p-8">
          <div className="h-7 w-48 animate-pulse rounded bg-base-300" />

          <div className="mt-6 h-64 animate-pulse rounded-2xl bg-base-300" />
        </div>
      </section>
    </main>
  );
}