import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="text-7xl">🛒</div>

      <h1 className="mt-6 text-4xl font-black">
        পেজটি পাওয়া যায়নি
      </h1>

      <p className="mt-3 text-gray-500">
        আপনি যে পেজটি খুঁজছেন সেটি হয়তো আর নেই।
      </p>

      <Link
        href="/"
        className="btn btn-primary mt-8"
      >
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}