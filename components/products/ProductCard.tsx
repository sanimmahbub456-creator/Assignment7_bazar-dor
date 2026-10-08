import Link from "next/link";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
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

export default function ProductCard({
  product,
}: ProductCardProps) {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";
  const isFlat = product.change.dir === "flat";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
    >
      <article className="h-full rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">

        <div className="mb-5 flex items-center justify-between">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-base-200 text-4xl">
            {product.image}
          </div>

          <span className="rounded-full bg-base-200 px-3 py-1 text-xs font-medium">
            {product.categoryNameBn}
          </span>
        </div>

        <h3 className="text-lg font-bold group-hover:text-primary">
          {product.nameBn}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          প্রতি {unitLabel[product.unit]}
        </p>

        <div className="mt-5">
          <p className="text-sm text-gray-500">
            আজকের দাম
          </p>

          <div className="mt-1 flex items-end gap-2">
            <span className="text-3xl font-black">
              ৳{toBanglaNumber(product.today)}
            </span>

            <span className="mb-1 text-sm text-gray-500">
              / {unitLabel[product.unit]}
            </span>
          </div>
        </div>

        <div className="mt-4">
          {isUp && (
            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              ▲ {toBanglaNumber(product.change.pct)}%
            </span>
          )}

          {isDown && (
            <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
              ▼ {toBanglaNumber(Math.abs(product.change.pct))}%
            </span>
          )}

          {isFlat && (
            <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
              — অপরিবর্তিত
            </span>
          )}
        </div>

      </article>
    </Link>
  );
}