import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-base-200">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        
        <div>
          <p className="mb-4 font-semibold text-primary">
            প্রতিদিনের বাজারদর এক নজরে
          </p>

          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            আজকের বাজারদর,
            <br />
            সহজেই জানুন।
          </h1>

          <p className="mt-6 max-w-xl text-lg text-gray-600">
            চাল, ডাল, তেল, সবজি, মাছ ও মাংস—
            প্রয়োজনীয় পণ্যের দাম এক জায়গায়।
          </p>

          <Link
            href="#সব-পণ্য"
            className="btn btn-primary mt-8"
          >
            সব পণ্য দেখুন
          </Link>
        </div>

        <div className="flex min-h-72 items-center justify-center rounded-3xl bg-base-100 text-9xl shadow-sm">
          🛒
        </div>

      </div>
    </section>
  );
}