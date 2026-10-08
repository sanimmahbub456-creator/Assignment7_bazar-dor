import Link from "next/link";
import { getProducts } from "@/lib/api";
import type { Product } from "@/types/product";
import ProductCard from "@/components/products/ProductCard";

export default async function HomePage() {
  const products: Product[] = await getProducts();

  const risingProducts = [...products]
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const fallingProducts = [...products]
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, 6);

  return (
    <main>

      {/* ================= HERO ================= */}
      <section className="bg-base-200">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">

          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">
              আজকের বাজারদর
            </p>

            <h1 className="text-4xl font-black leading-tight md:text-6xl">
              বাজারের দাম
              <br />
              জানুন এক নজরে।
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-gray-600 md:text-lg">
              চাল, ডাল, তেল, সবজি, মাছ, মাংসসহ
              প্রয়োজনীয় পণ্যের আজকের বাজারদর
              সহজেই দেখুন।
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#সব-পণ্য"
                className="btn btn-primary"
              >
                সব পণ্য দেখুন
              </a>

              <Link
                href="/category/chal"
                className="btn btn-outline"
              >
                চালের দাম দেখুন
              </Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-4">

              <div className="flex h-36 w-36 items-center justify-center rounded-3xl bg-base-100 text-7xl shadow-lg md:h-44 md:w-44">
                🥬
              </div>

              <div className="mt-8 flex h-36 w-36 items-center justify-center rounded-3xl bg-base-100 text-7xl shadow-lg md:h-44 md:w-44">
                🐟
              </div>

              <div className="-mt-4 flex h-36 w-36 items-center justify-center rounded-3xl bg-base-100 text-7xl shadow-lg md:h-44 md:w-44">
                🍚
              </div>

              <div className="flex h-36 w-36 items-center justify-center rounded-3xl bg-base-100 text-7xl shadow-lg md:h-44 md:w-44">
                🥚
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ================= RISING PRODUCTS ================= */}
      <section className="mx-auto max-w-6xl px-4 py-16">

        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-500">
              আজকের পরিবর্তন
            </p>

            <h2 className="mt-1 text-3xl font-black">
              আজ দাম বেড়েছে ▲
            </h2>

            <p className="mt-2 text-gray-500">
              যেসব পণ্যের দাম আজ সবচেয়ে বেশি বেড়েছে
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {risingProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      </section>

      {/* ================= FALLING PRODUCTS ================= */}
      <section className="bg-base-200">
        <div className="mx-auto max-w-6xl px-4 py-16">

          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-500">
              আজকের পরিবর্তন
            </p>

            <h2 className="mt-1 text-3xl font-black">
              আজ দাম কমেছে ▼
            </h2>

            <p className="mt-2 text-gray-500">
              যেসব পণ্যের দাম আজ সবচেয়ে বেশি কমেছে
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fallingProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ================= ALL PRODUCTS ================= */}
      <section
        id="সব-পণ্য"
        className="mx-auto max-w-6xl px-4 py-16"
      >

        <div className="mb-8">
          <p className="text-sm font-semibold text-primary">
            পণ্যের তালিকা
          </p>

          <h2 className="mt-1 text-3xl font-black">
            সব পণ্য
          </h2>

          <p className="mt-2 text-gray-500">
            প্রয়োজনীয় সব পণ্যের আজকের বাজারদর একসাথে দেখুন।
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      </section>

      {/* ================= CATEGORY CTA ================= */}
      <section className="bg-base-200">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">

          <h2 className="text-3xl font-black">
            ক্যাটাগরি অনুযায়ী দাম দেখুন
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            আপনার প্রয়োজনীয় পণ্যের ক্যাটাগরি নির্বাচন করে
            দ্রুত বাজারদর দেখুন।
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">

            <Link
              href="/category/chal"
              className="btn btn-outline"
            >
              🍚 চাল
            </Link>

            <Link
              href="/category/dal"
              className="btn btn-outline"
            >
              🫘 ডাল
            </Link>

            <Link
              href="/category/tel"
              className="btn btn-outline"
            >
              🫗 তেল
            </Link>

            <Link
              href="/category/sobji"
              className="btn btn-outline"
            >
              🥬 সবজি
            </Link>

            <Link
              href="/category/mach"
              className="btn btn-outline"
            >
              🐟 মাছ
            </Link>

            <Link
              href="/category/mangsho"
              className="btn btn-outline"
            >
              🍖 মাংস
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}