"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(
        error.message || "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।"
      );
      return;
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          স্বাগতম
        </h1>

        <p className="text-center text-gray-500 mb-6">
          আপনার বাজার দর অ্যাকাউন্টে সাইন ইন করুন
        </p>

        <form onSubmit={handleSignIn} className="space-y-4">
          <input
            type="email"
            placeholder="আপনার ইমেইল ঠিকানা লিখুন"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            type="password"
            placeholder="আপনার পাসওয়ার্ড লিখুন"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-3"
          />

          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          আপনার কি এখনো অ্যাকাউন্ট নেই?{" "}
          <a
            href="/sign-up"
            className="text-green-600 font-semibold"
          >
            নতুন অ্যাকাউন্ট তৈরি করুন
          </a>
        </p>
      </div>
    </div>
  );
}