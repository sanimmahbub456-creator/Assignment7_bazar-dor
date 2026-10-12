import Link from "next/link";

export default function CategoryNotFound() {
  return (
    <main className="flex min-h-[65vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-base-300 bg-base-100 p-8 text-center shadow-sm">
        <div className="text-5xl">🔎</div>

        <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-primary">
          404 — Category Not Found
        </p>

        <h1 className="mt-3 text-2xl font-bold">
          ক্যাটাগরি পাওয়া যায়নি
        </h1>

        <p className="mt-3 text-sm leading-6 text-base-content/60">
          এই ক্যাটাগরিটি নেই অথবা এখানে কোনো পণ্য পাওয়া যাচ্ছে না।
        </p>

        <Link href="/" className="btn btn-primary mt-6">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}