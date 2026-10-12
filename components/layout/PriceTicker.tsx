
"use client";

import { useEffect, useState } from "react";

interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon?: string;
  unit: "kg" | "litre" | "dozen" | "piece";
  today: number;
  change?: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
}

function formatBengaliNumber(value: number): string {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Convert API units into Bengali.
 */
function formatBengaliUnit(unit: Product["unit"]): string {
  const units: Record<Product["unit"], string> = {
    kg: "কেজি",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
  };

  return units[unit] ?? unit;
}

/**
 * Returns an emoji appropriate to the product.
 */
function getProductEmoji(product: Product): string {
  const slug = (product.slug || "").toLowerCase();
  const name = (product.nameBn || "").toLowerCase();
  const category = (product.category || "").toLowerCase();
  const categoryName = (product.categoryNameBn || "").toLowerCase();

  const text = `${slug} ${name} ${category} ${categoryName}`;

  // Rice
  if (/চাল|rice|chal|miniket|najirshail|নাজিরশাইল|মিনিকেট/.test(text)) {
    return "🍚";
  }

  // Pulses and lentils
  if (/ডাল|lentil|dal|mosur|মসুর|মুগ|মুগডাল|ছোলা|chickpea|বুট/.test(text)) {
    if (/মুগ|mung|green gram/.test(text)) return "🫛";
    if (/ছোলা|chickpea|বুট/.test(text)) return "🫘";
    return "🫘";
  }

  // Oil
  if (/তেল|oil|soyabean|সয়াবিন|সরিষা|mustard/.test(text)) {
    return "🛢️";
  }

  // Vegetables
  if (/পেঁয়াজ|পিয়াজ|onion|peyaj/.test(text)) return "🧅";
  if (/রসুন|garlic|roshun/.test(text)) return "🧄";
  if (/আদা|ginger|ada/.test(text)) return "🫚";
  if (/আলু|potato|alu/.test(text)) return "🥔";
  if (/টমেটো|tomato/.test(text)) return "🍅";
  if (/বেগুন|eggplant|aubergine/.test(text)) return "🍆";
  if (/গাজর|carrot/.test(text)) return "🥕";
  if (/ফুলকপি|cauliflower/.test(text)) return "🥦";
  if (/বাঁধাকপি|cabbage/.test(text)) return "🥬";
  if (/শসা|cucumber/.test(text)) return "🥒";
  if (/মরিচ|chili|chilli|pepper/.test(text)) return "🌶️";
  if (/লাউ|bottle gourd/.test(text)) return "🥒";
  if (/কুমড়া|pumpkin/.test(text)) return "🎃";
  if (/ঢেঁড়স|okra|lady finger/.test(text)) return "🌿";
  if (/সবজি|vegetable|শাক|spinach|পালং/.test(text)) return "🥬";

  // Fish and seafood
  if (/চিংড়ি|চিংড়ি|shrimp|prawn/.test(text)) return "🦐";
  if (/কাঁকড়া|কাঁকড়া|crab/.test(text)) return "🦀";
  if (/ইলিশ|ilish|hilsa/.test(text)) return "🐟";
  if (/মাছ|fish|রুই|কাতলা|তেলাপিয়া|পাঙ্গাস|মৃগেল/.test(text)) {
    return "🐟";
  }

  // Meat and poultry
  if (/গরুর মাংস|beef|গরু/.test(text)) return "🥩";
  if (/খাসির মাংস|mutton|goat|খাসি/.test(text)) return "🍖";
  if (/মুরগি|chicken|broiler|কক/.test(text)) return "🍗";
  if (/মাংস|meat/.test(text)) return "🥩";

  // Eggs and dairy
  if (/ডিম|egg/.test(text)) return "🥚";
  if (/দুধ|milk/.test(text)) return "🥛";
  if (/দই|yogurt|yoghurt/.test(text)) return "🥣";
  if (/মাখন|butter/.test(text)) return "🧈";
  if (/পনির|cheese/.test(text)) return "🧀";

  // Spices
  if (/হলুদ|turmeric/.test(text)) return "🟡";
  if (/জিরা|cumin/.test(text)) return "🌿";
  if (/ধনিয়া|ধনে|coriander/.test(text)) return "🌿";
  if (/দারুচিনি|cinnamon/.test(text)) return "🪵";
  if (/এলাচ|cardamom/.test(text)) return "🌱";
  if (/লবঙ্গ|clove/.test(text)) return "🌸";
  if (/মসলা|মশলা|spice|মরিচ গুঁড়া|গুঁড়া মরিচ/.test(text)) {
    return "🌶️";
  }

  // Flour, grains and pantry items
  if (/আটা|flour|atta/.test(text)) return "🌾";
  if (/ময়দা|ময়দা|maida/.test(text)) return "🥣";
  if (/চিনি|sugar/.test(text)) return "🍬";
  if (/লবণ|নুন|salt/.test(text)) return "🧂";

  // Fruits
  if (/কলা|banana/.test(text)) return "🍌";
  if (/আপেল|apple/.test(text)) return "🍎";
  if (/কমলা|orange/.test(text)) return "🍊";
  if (/আম\b|আম |mango|aam/.test(text)) return "🥭";
  if (/কাঁঠাল|jackfruit/.test(text)) return "🍈";
  if (/পেঁপে|papaya/.test(text)) return "🍈";
  if (/তরমুজ|watermelon/.test(text)) return "🍉";
  if (/আনারস|pineapple/.test(text)) return "🍍";
  if (/আঙুর|grape/.test(text)) return "🍇";
  if (/ফল|fruit/.test(text)) return "🍎";

  // Tea and beverages
  if (/চা পাতা|tea/.test(text)) return "🍵";
  if (/কফি|coffee/.test(text)) return "☕";

  // Category fallback
  if (/মাছ|fish/.test(categoryName)) return "🐟";
  if (/মাংস|meat/.test(categoryName)) return "🥩";
  if (/সবজি|vegetable/.test(categoryName)) return "🥬";
  if (/ফল|fruit/.test(categoryName)) return "🍎";
  if (/ডিম|দুধ|dairy/.test(categoryName)) return "🥛";
  if (/মসলা|মশলা|spice/.test(categoryName)) return "🌶️";
  if (/ডাল|pulse|lentil/.test(categoryName)) return "🫘";
  if (/চাল|rice/.test(categoryName)) return "🍚";

  return "🛒";
}

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor/products";

function extractProducts(result: unknown): Product[] {
  let list: unknown = result;

  if (result && typeof result === "object" && !Array.isArray(result)) {
    const data = result as Record<string, unknown>;

    list =
      data.Products ??
      data.products ??
      data.value ??
      data.data;
  }

  if (!Array.isArray(list)) {
    console.error("Unexpected Bazar Dor API response:", result);
    throw new Error("Product array not found in API response.");
  }

  return list.filter((item): item is Product => {
    if (!item || typeof item !== "object") return false;

    const product = item as Record<string, unknown>;

    return (
      typeof product.id === "number" &&
      typeof product.nameBn === "string" &&
      typeof product.today === "number"
    );
  });
}

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(API_URL, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const result: unknown = await response.json();
        const validProducts = extractProducts(result);

        if (validProducts.length === 0) {
          throw new Error("No valid products found.");
        }

        if (!cancelled) {
          setProducts(validProducts);
        }
      } catch (err) {
        console.error("Failed to load Bazar Dor prices:", err);

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="price-ticker">
        <div className="ticker-container">
          <span className="ticker-label">আজকের বাজারদর</span>
          <p className="ticker-loading">বাজারদর লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="price-ticker" aria-live="polite">
        <div className="ticker-container">
          <span className="ticker-label">আজকের বাজারদর</span>
          <p className="ticker-loading">
            এই মুহূর্তে বাজারদর লোড করা যাচ্ছে না।
          </p>
        </div>
      </div>
    );
  }

  function renderProductGroup(group: string) {
    return (
      <div className="ticker-group" key={group}>
        {products.map((product) => {
          const direction = product.change?.dir;

          const changeClass =
            direction === "up"
              ? "ticker-up"
              : direction === "down"
                ? "ticker-down"
                : "ticker-flat";

          const symbol =
            direction === "up"
              ? "▲"
              : direction === "down"
                ? "▼"
                : "—";

          return (
            <div
              className="ticker-item"
              key={`${group}-${product.id}`}
            >
              <span
                className="ticker-product-icon"
                role="img"
                aria-label={product.nameBn}
              >
                {getProductEmoji(product)}
              </span>

              <span className="ticker-product-name">
                {product.nameBn}
              </span>

              <span className="ticker-price">
                ৳{formatBengaliNumber(product.today)}
              </span>

              <span className="ticker-unit">
                /{formatBengaliUnit(product.unit)}
              </span>

              {typeof product.change?.pct === "number" && (
                <span className={`ticker-change ${changeClass}`}>
                  {symbol}{" "}
                  {formatBengaliNumber(
                    Math.abs(product.change.pct)
                  )}
                  %
                </span>
              )}

              <span className="ticker-separator">●</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <section
      className="price-ticker"
      aria-label="আজকের নিত্যপণ্যের বাজারদর"
    >
      <div className="ticker-container">
        <span className="ticker-label">আজকের বাজারদর</span>

        <div className="ticker-viewport">
          <div className="ticker-track">
            {renderProductGroup("first")}
            {renderProductGroup("second")}
          </div>
        </div>
      </div>
    </section>
  );
}
