import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import PriceTicker from "@/components/layout/PriceTicker";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "বাজার দর | BazarDor",
  description:
    "প্রয়োজনীয় পণ্যের বাজারদর এক নজরে।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>
        <Navbar />
        <PriceTicker />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}