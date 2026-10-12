
import type { Category, Market, Product } from "@/types/product";

const API_BASE_URL =
  "https://openapi.programming-hero.com/api/bazardor";

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getString(
  record: Record<string, unknown>,
  keys: string[],
  fallback = "",
): string {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return fallback;
}

function getNumber(
  record: Record<string, unknown>,
  keys: string[],
  fallback = 0,
): number {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return fallback;
}

function normalizeMarkets(value: unknown): Market[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((item) => ({
    market: getString(item, ["market", "marketName", "market_name", "name"]),
    division: getString(item, [
      "division",
      "divisionName",
      "division_name",
    ]),
    min: getNumber(item, [
      "min",
      "minimumPrice",
      "minimum_price",
      "minPrice",
    ]),
    max: getNumber(item, [
      "max",
      "maximumPrice",
      "maximum_price",
      "maxPrice",
    ]),
  }));
}

function normalizeProduct(value: unknown): Product | null {
  if (!isRecord(value)) {
    return null;
  }

  const slug = getString(value, ["slug", "productSlug"]);
  const nameBn = getString(value, [
    "nameBn",
    "name_bn",
    "name",
    "title",
    "productName",
  ]);

  if (!slug || !nameBn) {
    return null;
  }

  const rawChange = isRecord(value.change) ? value.change : {};
  const rawDirection = getString(
    rawChange,
    ["dir", "direction"],
    "flat",
  );

  const dir: Product["change"]["dir"] =
    rawDirection === "up" ||
    rawDirection === "down" ||
    rawDirection === "flat"
      ? rawDirection
      : "flat";

  const rawUnit = getString(value, ["unit"], "kg");

  const unit: Product["unit"] =
    rawUnit === "kg" ||
    rawUnit === "litre" ||
    rawUnit === "dozen" ||
    rawUnit === "piece"
      ? rawUnit
      : "kg";

  return {
    id: getNumber(value, ["id", "productId", "_id"]),
    slug,
    nameBn,
    category: getString(value, ["category", "categorySlug"]),
    categoryNameBn: getString(value, [
      "categoryNameBn",
      "category_name_bn",
      "categoryName",
    ]),
    categoryIcon: getString(
      value,
      ["categoryIcon", "category_icon", "icon"],
      "🛒",
    ),
    unit,
    image: getString(value, ["image", "imageUrl", "image_url"], "🛒"),
    today: getNumber(value, ["today", "todayPrice", "today_price"]),
    yesterday: getNumber(value, [
      "yesterday",
      "yesterdayPrice",
      "yesterday_price",
    ]),
    lastWeek: getNumber(value, [
      "lastWeek",
      "last_week",
      "lastWeekPrice",
      "last_week_price",
    ]),
    lastMonth: getNumber(value, [
      "lastMonth",
      "last_month",
      "lastMonthPrice",
      "last_month_price",
    ]),
    change: {
      dir,
      pct: getNumber(rawChange, ["pct", "percentage", "percent"]),
    },
    markets: normalizeMarkets(value.markets),
  };
}

function normalizeCategory(value: unknown): Category | null {
  if (!isRecord(value)) {
    return null;
  }

  const slug = getString(value, ["slug", "categorySlug"]);
  const nameBn = getString(value, [
    "nameBn",
    "name_bn",
    "name",
    "title",
  ]);

  if (!slug || !nameBn) {
    return null;
  }

  return {
    id: getString(value, ["id", "_id"], slug),
    slug,
    nameBn,
    icon: getString(value, ["icon", "categoryIcon"], "🛒"),
  };
}

function findArray(
  value: unknown,
  isValidItem: (item: unknown) => boolean,
): unknown[] | null {
  if (Array.isArray(value)) {
    if (value.length > 0 && value.every(isValidItem)) {
      return value;
    }

    for (const item of value) {
      const result = findArray(item, isValidItem);

      if (result) {
        return result;
      }
    }

    return null;
  }

  if (isRecord(value)) {
    // Prefer common API response keys before checking other nested values.
    for (const key of ["data", "products", "categories", "result"]) {
      if (key in value) {
        const result = findArray(value[key], isValidItem);

        if (result) {
          return result;
        }
      }
    }

    for (const child of Object.values(value)) {
      const result = findArray(child, isValidItem);

      if (result) {
        return result;
      }
    }
  }

  return null;
}

function findRecord(
  value: unknown,
  isValidItem: (item: unknown) => boolean,
): unknown | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const result = findRecord(item, isValidItem);

      if (result !== null) {
        return result;
      }
    }

    return null;
  }

  if (!isRecord(value)) {
    return null;
  }

  if (isValidItem(value)) {
    return value;
  }

  for (const key of ["data", "product", "category", "result"]) {
    if (key in value) {
      const result = findRecord(value[key], isValidItem);

      if (result !== null) {
        return result;
      }
    }
  }

  for (const child of Object.values(value)) {
    const result = findRecord(child, isValidItem);

    if (result !== null) {
      return result;
    }
  }

  return null;
}

function isProduct(value: unknown): boolean {
  return normalizeProduct(value) !== null;
}

function isCategory(value: unknown): boolean {
  return normalizeCategory(value) !== null;
}

export async function getProducts(): Promise<Product[]> {
  const json = await fetchJson(`${API_BASE_URL}/products`);
  const records = findArray(json, isProduct);

  if (!records) {
    throw new Error(
      "Products array not found. Check the API response structure.",
    );
  }

  return records
    .map(normalizeProduct)
    .filter((item): item is Product => item !== null);
}

export async function getProductById(
  id: number,
): Promise<Product | null> {
  if (!Number.isSafeInteger(id) || id <= 0) {
    return null;
  }

  const json = await fetchJson(`${API_BASE_URL}/products/${id}`);
  const record = findRecord(json, isProduct);

  return record ? normalizeProduct(record) : null;
}

export async function getProduct(
  slug: string,
): Promise<Product | null> {
  const decodedSlug = decodeURIComponent(slug).trim();

  if (!decodedSlug) {
    return null;
  }

  if (/^\d+$/.test(decodedSlug)) {
    try {
      const product = await getProductById(Number(decodedSlug));

      if (product) {
        return product;
      }
    } catch (error) {
      console.warn("Product ID lookup failed:", error);
    }
  }

  const products = await getProducts();

  return (
    products.find((product) => product.slug === decodedSlug) ?? null
  );
}

export async function getCategories(): Promise<Category[]> {
  const json = await fetchJson(`${API_BASE_URL}/categories`);
  const records = findArray(json, isCategory);

  if (!records) {
    throw new Error(
      "Categories array not found. Check the API response structure.",
    );
  }

  return records
    .map(normalizeCategory)
    .filter((item): item is Category => item !== null);
}

export async function getCategory(
  slug: string,
): Promise<Category | null> {
  const decodedSlug = decodeURIComponent(slug).trim();

  if (!decodedSlug) {
    return null;
  }

  const categories = await getCategories();

  return (
    categories.find((category) => category.slug === decodedSlug) ?? null
  );
}

export async function getProductsByCategory(
  category: string,
): Promise<Product[]> {
  const decodedCategory = decodeURIComponent(category).trim();

  if (!decodedCategory) {
    return [];
  }

  const url = new URL(`${API_BASE_URL}/products`);
  url.searchParams.set("category", decodedCategory);

  const json = await fetchJson(url.toString());
  const records = findArray(json, isProduct);

  if (!records) {
    throw new Error(
      `Products not found for category: ${decodedCategory}`,
    );
  }

  return records
    .map(normalizeProduct)
    .filter((item): item is Product => item !== null);
}
