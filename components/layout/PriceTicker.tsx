"use client";

const tickerItems = [
  ["🍚", "চাল", "১৪৮", "▲ ২.১%"],
  ["🥔", "আলু", "৪৫", "▼ ১.৮%"],
  ["🧅", "পেঁয়াজ", "৯০", "▲ ৩.২%"],
  ["🌶️", "মরিচ", "১৮০", "▼ ০.৯%"],
  ["🐟", "ইলিশ", "১৮৫০", "▲ ৪.৫%"],
];

export default function PriceTicker() {
  return (
    <div className="overflow-hidden border-b bg-neutral text-neutral-content">
      <div className="flex min-w-max animate-[ticker_25s_linear_infinite] gap-8 px-4 py-2">
        {[...tickerItems, ...tickerItems].map(
          ([emoji, name, price, change], index) => (
            <span
              key={`${name}-${index}`}
              className="flex items-center gap-2 text-sm"
            >
              {emoji} {name} {price} টাকা
              <strong>{change}</strong>
            </span>
          )
        )}
      </div>
    </div>
  );
}