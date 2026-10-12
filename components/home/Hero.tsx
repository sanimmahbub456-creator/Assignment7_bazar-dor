"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero() {
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(
      new Intl.DateTimeFormat("bn-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date())
    );
  }, []);

  return (
    <section className="overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
        
{/* Left: Hero content */}
<div className="order-2 lg:order-1">
  {today && (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-800 shadow-sm">
      <span className="h-2 w-2 rounded-full bg-green-600" />
      <span>{today}</span>
    </div>
  )}

  <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
    আজকের বাজারের দাম{" "}
    <span className="text-green-700">এক নজরে</span>
  </h1>

  <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
    চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম—
    বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং
    দামের পরিবর্তন এক জায়গায়।
  </p>

  <div className="mt-8">
    <a
      href="#সব-পণ্য"
      className="inline-flex items-center justify-center gap-3 rounded-xl bg-green-700 px-7 py-4 font-bold text-white shadow-lg shadow-green-700/20 transition hover:-translate-y-0.5 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300"
    >
      সব পণ্য দেখুন
      <span aria-hidden="true">↓</span>
    </a>
  </div>
</div>

        {/* Right: PNG image only; no text overlay */}
        <div className="order-1 lg:order-2">
          <div className="relative mx-auto aspect-[3/2] w-full max-w-xl">
            <Image
  src="/bazar-hero.png"
  alt="বাজার দর — নিত্যপ্রয়োজনীয় পণ্যের বাজারদর"
  fill
  priority
  sizes="(max-width: 500px) 80vw, 30vw"
  className="object-contain"
/>
          </div>
        </div>
      </div>
    </section>
  );
}