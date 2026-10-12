import { Suspense } from "react";
import Image from "next/image";
import { connection } from "next/server";

import { getProducts } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/types/product";

function bengaliDate() {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());
}

function formatBengaliNumber(value: number) {
  return new Intl.NumberFormat("bn-BD").format(value);
}

async function HomeContent() {
  await connection();

  let products: Product[] = [];
  let apiError = false;

  try {
    products = await getProducts();
  } catch (error) {
    console.error("Homepage API error:", error);
    apiError = true;
  }

  const allProducts = products.slice(0, 33);

  const risingProducts = products
    .filter((product) => product.change?.dir === "up")
    .sort(
      (a, b) =>
        (b.change?.pct ?? 0) - (a.change?.pct ?? 0),
    )
    .slice(0, 6);

  const fallingProducts = products
    .filter((product) => product.change?.dir === "down")
    .sort(
      (a, b) =>
        (b.change?.pct ?? 0) - (a.change?.pct ?? 0),
    )
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-base-100">
      {/* Hero / Banner */}
      <section className="overflow-hidden bg-base-200">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-2 md:py-20">
          <div className="order-2 md:order-1">
            <p className="mb-3 text-sm font-semibold text-green-700">
              {bengaliDate()}
            </p>

            <h1 className="max-w-2xl text-2xl font-black leading-tight tracking-tight text-base-content sm:text-2xl lg:text-3xl">
              আজকের বাজারের দাম
              <span className="mt-2 block text-primary">
                এক নজরে
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-base-content/70 sm:text-lg">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
              বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং
              দামের পরিবর্তন এক জায়গায়।
            </p>

            <a
              href="#সব-পণ্য"
              className="btn btn-primary mt-8 min-h-12 px-7 text-base shadow-lg shadow-primary/20"
            >
              সব পণ্য দেখুন
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="order-1 md:order-2">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-3xl bg-base-100 shadow-xl">
              <Image
                src="/bazar-hero.png"
                alt="বাজার দর — নিত্যপ্রয়োজনীয় পণ্য ও বাজারের দৃশ্য"
                fill
                priority
                sizes="(max-width: 350px) 80vw, 30vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* API Error Message */}
      {apiError ? (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="rounded-2xl border border-error/30 bg-error/5 p-6">
            <h2 className="text-xl font-bold">
              পণ্যের তথ্য লোড করা যায়নি
            </h2>

            <p className="mt-2 text-base-content/70">
              API সাময়িকভাবে unavailable হতে পারে। কিছুক্ষণ পরে
              আবার চেষ্টা করুন।
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* Section A: Rising Prices */}
          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
            <div className="mb-6">
              <h2 className="text-2xl font-black md:text-3xl">
                আজ দাম বেড়েছে{" "}
                <span className="text-success">▲</span>
              </h2>

              <p className="mt-2 text-sm text-base-content/60">
                আজ যেসব পণ্যের দাম সবচেয়ে বেশি বেড়েছে
              </p>
            </div>

            {risingProducts.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {risingProducts.map((product) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-base-200 p-5 text-base-content/60">
                দাম বেড়েছে এমন পণ্যের তথ্য পাওয়া যায়নি।
              </p>
            )}
          </section>

          {/* Section B: Falling Prices */}
          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
            <div className="mb-6">
              <h2 className="text-2xl font-black md:text-3xl">
                আজ দাম কমেছে{" "}
                <span className="text-error">▼</span>
              </h2>

              <p className="mt-2 text-sm text-base-content/60">
                আজ যেসব পণ্যের দাম সবচেয়ে বেশি কমেছে
              </p>
            </div>

            {fallingProducts.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {fallingProducts.map((product) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-base-200 p-5 text-base-content/60">
                দাম কমেছে এমন পণ্যের তথ্য পাওয়া যায়নি।
              </p>
            )}
          </section>

          {/* Section C: All Products */}
          <section
            id="সব-পণ্য"
            className="mx-auto max-w-7xl scroll-mt-24 px-4 py-8 sm:px-6 sm:py-10"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-black md:text-3xl">
                সব পণ্য
                <span className="ml-2 text-base font-semibold text-base-content/60">
                  ({formatBengaliNumber(allProducts.length)}টি পণ্য)
                </span>
              </h2>

              <p className="mt-2 text-sm text-base-content/60">
                {formatBengaliNumber(allProducts.length)}টি
                নিত্যপ্রয়োজনীয় পণ্যের দাম, একক ও দামের পরিবর্তন
                এক জায়গায় দেখুন।
              </p>
            </div>

            {allProducts.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {allProducts.map((product) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-base-200 p-5 text-base-content/60">
                এই মুহূর্তে কোনো পণ্যের তথ্য পাওয়া যায়নি।
              </p>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-base-100 p-8">
          <p className="text-center text-base-content/70">
            পণ্যের তথ্য লোড হচ্ছে...
          </p>
        </main>
      }
    >
      <HomeContent />
    </Suspense>
  );
}