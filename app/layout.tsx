import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Hind_Siliguri } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import PriceTicker from "@/components/layout/PriceTicker";
import Footer from "@/components/layout/Footer";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "বাজার দর | বাংলাদেশের নিত্যপণ্যের বাজারদর",
  description:
    "চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম-দুধ ও মসলার বাজারদর দেখুন।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className={hindSiliguri.className}>
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3000}
        />

        <Suspense fallback={null}>
          <Navbar />
        </Suspense>

        <PriceTicker />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}