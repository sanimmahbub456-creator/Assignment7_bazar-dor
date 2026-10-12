
import Link from "next/link";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

const unitLabels: Record<string, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

function formatBengaliNumber(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ProductCard({ product }: ProductCardProps) {
  const direction = product.change?.dir ?? "flat";
  const percentage = product.change?.pct ?? 0;

  const badgeStyle =
    direction === "up"
      ? "bg-success/10 text-success"
      : direction === "down"
        ? "bg-error/10 text-error"
        : "bg-base-200 text-base-content/60";

  const badgeIcon =
    direction === "up" ? "▲" : direction === "down" ? "▼" : "—";

  const unitLabel = unitLabels[product.unit] ?? `প্রতি ${product.unit}`;

  const changeLabel =
    direction === "up"
      ? "দাম বেড়েছে"
      : direction === "down"
        ? "দাম কমেছে"
        : "দামের পরিবর্তন নেই";

  return (
    <Link
      href={`/product/${encodeURIComponent(product.slug)}`}
      aria-label={`${product.nameBn}, বিস্তারিত দেখুন`}
      className="group flex h-full min-w-0 flex-col rounded-xl border border-base-300 bg-base-100 p-2.5 transition hover:border-primary/50 hover:shadow-md sm:p-4"
    >
      {/* Product name and unit */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-base-200 text-lg sm:h-11 sm:w-11 sm:text-2xl">
          {product.image || product.categoryIcon || "🛒"}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-xs font-bold text-base-content group-hover:text-primary sm:text-base">
            {product.nameBn}
          </h3>

          <p className="mt-1 truncate text-xs text-base-content/60">
            {unitLabel}
          </p>
        </div>
      </div>

      {/* Price and percentage change */}
      <div className="mt-3 flex min-w-0 flex-wrap items-end justify-between gap-2 border-t border-base-200 pt-3">
        <div className="min-w-0">
          <p className="text-xs text-base-content/60">আজকের দাম</p>

          <p className="mt-1 text-sm font-black text-base-content sm:text-lg">
            ৳{formatBengaliNumber(product.today)}
          </p>
        </div>

        <span
          title={changeLabel}
          aria-label={`${changeLabel}: ${formatBengaliNumber(percentage)} শতাংশ`}
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${badgeStyle}`}
        >
          {badgeIcon} {formatBengaliNumber(percentage)} শতাংশ
        </span>
      </div>
    </Link>
  );
}
