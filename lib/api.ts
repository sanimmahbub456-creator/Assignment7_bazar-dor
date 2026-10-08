const BASE_URL =
  "https://api.abcz.workers.dev/api/bazardor";

export async function getProducts() {
  const response = await fetch(`${BASE_URL}/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("পণ্যের তথ্য লোড করা যায়নি");
  }

  return response.json();
}

export async function getProduct(slug: string) {
  const productsResponse = await getProducts();

  const products = Array.isArray(productsResponse)
    ? productsResponse
    : productsResponse?.products ?? [];

  return (
    products.find(
      (product: { slug: string }) => product.slug === slug
    ) ?? null
  );
}

export async function getCategories() {
  const response = await fetch(`${BASE_URL}/categories`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("ক্যাটাগরির তথ্য লোড করা যায়নি");
  }

  return response.json();
}

export async function getCategory(slug: string) {
  const response = await fetch(
    `${BASE_URL}/categories/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}