"use client";

import Link from "next/link";

const categories = [
  { name: "সব", slug: "" },
  { name: "চাল", slug: "chal" },
  { name: "ডাল", slug: "dal" },
  { name: "তেল", slug: "tel" },
  { name: "সবজি", slug: "sobji" },
  { name: "মাছ", slug: "mach" },
  { name: "মাংস", slug: "mangsho" },
];

export default function Navbar() {
  return (
    <header className="border-b bg-base-100">
      <div className="mx-auto max-w-6xl px-4">
        
        <div className="flex min-h-20 items-center justify-between gap-4">
          
          <Link href="/" className="shrink-0">
            <div className="text-2xl font-black">
              🛒 বাজার দর
            </div>

            <div className="text-xs text-gray-500">
              ৮ অক্টোবর ২০২৬
            </div>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={
                  category.slug
                    ? `/category/${category.slug}`
                    : "/"
                }
                className="rounded-full px-4 py-2 text-sm font-medium transition hover:bg-base-200"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="flex gap-2">
            <Link
              href="/sign-in"
              className="btn btn-sm btn-outline"
            >
              সাইন ইন
            </Link>

            <Link
              href="/sign-up"
              className="btn btn-sm btn-primary"
            >
              সাইন আপ
            </Link>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 md:hidden">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={
                category.slug
                  ? `/category/${category.slug}`
                  : "/"
              }
              className="btn btn-sm whitespace-nowrap"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}