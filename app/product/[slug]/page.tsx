
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";
import { getProduct } from "@/lib/api";
import type { Product } from "@/types/product";

function formatPrice(value: number): string {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

const unitLabels: Record<Product["unit"], string> = {
  kg: "কেজি",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

export default function ProductDetailsPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const slug = params.slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isPending && !session?.user) {
      const callbackURL = `/product/${encodeURIComponent(slug)}`;

      router.replace(
        `/sign-in?callbackURL=${encodeURIComponent(callbackURL)}`
      );
    }
  }, [isPending, session?.user, slug, router]);

  useEffect(() => {
    if (isPending || !session?.user || !slug) return;

    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      setError("");

      try {
        const result = await getProduct(slug);

        if (cancelled) return;

        if (!result) {
          setProduct(null);
          setError("এই পণ্যটি খুঁজে পাওয়া যায়নি।");
          return;
        }

        setProduct(result);
      } catch (err) {
        if (cancelled) return;

        console.error("Product loading failed:", err);
        setError("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadProduct();

    return () => {
      cancelled = true;
    };
  }, [isPending, session?.user, slug]);

  if (isPending || !session?.user || loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-6">
        <span className="loading loading-spinner loading-lg" />
        <span className="ml-3">পণ্যের তথ্য লোড হচ্ছে...</span>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4 py-12">
        <div className="max-w-lg text-center">
          <div className="mb-4 text-5xl">🔎</div>

          <h1 className="text-2xl font-bold">
            পণ্য পাওয়া যায়নি
          </h1>

          <p className="mt-3 text-base-content/70">
            {error || "এই পণ্যের তথ্য পাওয়া যায়নি।"}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => window.location.reload()}
            >
              আবার চেষ্টা করুন
            </button>

            <Link href="/" className="btn btn-primary">
              হোম পেজে ফিরে যান
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const marketPrices = (product.markets ?? [])
    .map((market) => ({
      ...market,
      min: Number(market.min),
      max: Number(market.max),
    }))
    .filter(
      (market) =>
        Number.isFinite(market.min) &&
        Number.isFinite(market.max) &&
        market.min >= 0 &&
        market.max >= 0
    );

  const allPrices = marketPrices.flatMap((market) => [
    market.min,
    market.max,
  ]);

  const minPrice =
    allPrices.length > 0 ? Math.min(...allPrices) : null;

  const maxPrice =
    allPrices.length > 0 ? Math.max(...allPrices) : null;

  const averagePrice =
    allPrices.length > 0
      ? allPrices.reduce((total, price) => total + price, 0) /
        allPrices.length
      : null;

  const unitLabel = unitLabels[product.unit] ?? "একক";

  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  const changeLabel = isUp
    ? "দাম বেড়েছে"
    : isDown
      ? "দাম কমেছে"
      : "দাম অপরিবর্তিত";

  const changeColor = isUp
    ? "text-error"
    : isDown
      ? "text-success"
      : "text-base-content/70";

  const priceDifference = Math.abs(
    product.today - product.yesterday
  );

  return (
    <main className="min-h-screen bg-base-200 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="link link-hover text-sm">
          ← হোম পেজে ফিরে যান
        </Link>

        {/* Product details: left information and right price card */}
        <section className="mt-5 rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-8">
          <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-[1fr_auto] sm:gap-8">
            {/* Left side: Product information */}
            <div className="min-w-0">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-base-200 text-4xl">
                {product.image || product.categoryIcon || "🛒"}
              </div>

              <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                {product.nameBn}
              </h1>

              <p className="mt-2 text-sm text-base-content/70">
                প্রতি {unitLabel} ·{" "}
                {product.categoryNameBn ||
                  product.category ||
                  "নিত্যপ্রয়োজনীয় পণ্য"}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="badge badge-outline">
                  {product.categoryIcon}{" "}
                  {product.categoryNameBn ||
                    product.category ||
                    "পণ্য"}
                </span>

                <span className="badge badge-outline">
                  {unitLabel}
                </span>
              </div>

              <div className="mt-6">
                <p className="text-sm text-base-content/70">
                  গতকালের তুলনায় আজ দাম
                </p>

                <p className={`mt-1 font-semibold ${changeColor}`}>
                  {changeLabel}

                {product.change.dir !== "flat" && (
                    <>
                      {" · "}
                      {formatPrice(priceDifference)} টাকা
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Right side: Today's price card */}
            <div className="w-full rounded-2xl border border-base-300 bg-base-200 p-5 sm:w-56 sm:p-6">
              <p className="text-sm text-base-content/70">
                আজকের দাম
              </p>

              <p className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
                {formatPrice(product.today)}
              </p>

              <p className="mt-2 text-sm text-base-content/70">
                টাকা / {unitLabel}
              </p>

              <p className={`mt-4 flex items-center gap-2 font-bold ${changeColor}`}>
                <span aria-hidden="true">
                  {isUp ? "▲" : isDown ? "▼" : "—"}
                </span>

                <span>
                  {formatPrice(Math.abs(product.change.pct))}%
                </span>
              </p>

              <p className="mt-1 text-xs text-base-content/60">
                {changeLabel}
              </p>
            </div>
          </div>
        </section>

        {/* Price summary */}
        <section className="mt-6">
          <h2 className="mb-4 text-xl font-bold">
            মূল্য সারাংশ
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "সর্বনিম্ন দাম", value: minPrice },
              { label: "সর্বোচ্চ দাম", value: maxPrice },
              { label: "গড় দাম", value: averagePrice },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-base-300 bg-base-100 p-5"
              >
                <p className="text-sm text-base-content/70">
                  {item.label}
                </p>

                <p className="mt-2 text-2xl font-extrabold">
                  {item.value === null
                    ? "তথ্য নেই"
                    : `৳${formatPrice(item.value)}`}
                </p>

                <p className="mt-1 text-xs text-base-content/60">
                  প্রতি {unitLabel}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Historical price comparison */}
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold">
            দামের তুলনা
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "গতকাল", value: product.yesterday },
              { label: "গত সপ্তাহ", value: product.lastWeek },
              { label: "গত মাস", value: product.lastMonth },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-base-300 bg-base-100 p-5"
              >
                <p className="text-sm text-base-content/70">
                  {item.label}
                </p>

                <p className="mt-2 text-xl font-bold">
                  ৳{formatPrice(item.value)}
                </p>

                <p className="mt-1 text-xs text-base-content/60">
                  প্রতি {unitLabel}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Market-wise prices */}
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold">
            বাজারভিত্তিক দাম
          </h2>

          {marketPrices.length === 0 ? (
            <div className="rounded-xl border border-base-300 bg-base-100 p-6 text-center text-base-content/70">
              এই পণ্যের বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100">
              <table className="table">
                <thead>
                  <tr>
                    <th>বাজার</th>
                    <th>বিভাগ</th>
                    <th>সর্বনিম্ন দাম</th>
                    <th>সর্বোচ্চ দাম</th>
                  </tr>
                </thead>

                <tbody>
                  {marketPrices.map((market, index) => (
                    <tr key={`${market.market}-${index}`}>
                      <td>{market.market || "—"}</td>
                      <td>{market.division || "—"}</td>
                      <td>৳{formatPrice(market.min)}</td>
                      <td>৳{formatPrice(market.max)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="mt-8">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => router.push("/")}
          >
            ← সব পণ্য দেখুন
          </button>
        </div>
      </div>
    </main>
  );
}
