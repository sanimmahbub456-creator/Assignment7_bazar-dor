"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName || !cleanEmail || !password) {
      setError("সবগুলো তথ্য পূরণ করুন।");
      return;
    }

    if (password.length < 8) {
      setError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      setError("দুটি পাসওয়ার্ড মিলছে না।");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name: cleanName,
        email: cleanEmail,
        password,
      });

      if (result.error) {
        const authError = result.error;

        console.error(
          "SIGN UP ERROR DETAILS:",
          JSON.stringify(authError, null, 2)
        );

        console.error("SIGN UP ERROR MESSAGE:", authError.message);
        console.error("SIGN UP ERROR STATUS:", authError.status);
        console.error("SIGN UP ERROR CODE:", authError.code);

        setError(
          authError.message ||
            authError.code ||
            "অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।"
        );

        return;
      }

      console.log("SIGN UP SUCCESS");

      router.push("/sign-in");
      router.refresh();
    } catch (err: unknown) {
      console.error("SIGN UP EXCEPTION:", err);

      if (err instanceof Error) {
        setError(
          `সমস্যা হয়েছে: ${err.message}`
        );
      } else {
        setError(
          "সার্ভারের সাথে যোগাযোগ করা যায়নি। আবার চেষ্টা করুন।"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-base-200 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-base-100 p-6 shadow-xl sm:p-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="text-5xl">🛒</span>
            <span className="mt-3 block text-2xl font-black">
              বাজার দর
            </span>
          </Link>

          <h1 className="mt-6 text-2xl font-bold">
            নতুন অ্যাকাউন্ট তৈরি করুন
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            আপনার অ্যাকাউন্ট তৈরি করে পণ্যের বিস্তারিত দেখুন।
          </p>
        </div>

        <form onSubmit={handleSignUp} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold"
            >
              আপনার নাম
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="আপনার পূর্ণ নাম"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
              disabled={loading}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold"
            >
              ইমেইল ঠিকানা
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              disabled={loading}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold"
            >
              পাসওয়ার্ড
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="কমপক্ষে ৮ অক্ষর"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              disabled={loading}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-semibold"
            >
              পাসওয়ার্ড নিশ্চিত করুন
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="আবার পাসওয়ার্ড লিখুন"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              autoComplete="new-password"
              required
              disabled={loading}
              className="input input-bordered w-full"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              <p className="font-semibold">
                অ্যাকাউন্ট তৈরি করা যায়নি
              </p>
              <p className="mt-1 break-words">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                অ্যাকাউন্ট তৈরি হচ্ছে...
              </>
            ) : (
              "অ্যাকাউন্ট তৈরি করুন"
            )}
          </button>
        </form>

        <div className="divider my-6">অথবা</div>

        <p className="text-center text-sm text-gray-600">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-primary hover:underline"
          >
            সাইন ইন করুন
          </Link>
        </p>

        <p className="mt-5 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-primary"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </p>
      </div>
    </main>
  );
}