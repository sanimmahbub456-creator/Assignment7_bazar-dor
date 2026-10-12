
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type SocialProvider = "google" | "github";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] =
    useState<SocialProvider | null>(null);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error("ইমেইল এবং পাসওয়ার্ড দিন।");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || "সাইন ইন করা যায়নি।");
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন ইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignIn(provider: SocialProvider) {
    setSocialLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "সোশ্যাল সাইন ইন ব্যর্থ হয়েছে।");
        setSocialLoading(null);
      }
    } catch {
      toast.error("সোশ্যাল সাইন ইন করতে সমস্যা হয়েছে।");
      setSocialLoading(null);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-3 py-8 sm:px-6">
      <section className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-5 shadow-xl sm:p-8">
        <Link
          href="/"
          className="mb-6 block text-center text-2xl font-bold text-primary sm:text-3xl"
        >
        
        </Link>

        <h1 className="text-center text-2xl font-bold sm:text-3xl">
          সাইন ইন
        </h1>

        <p className="mt-2 text-center text-sm text-base-content/70">
         বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>

        <form onSubmit={handleSignIn} className="mt-6 space-y-4">
          <div className="form-control">
            <label htmlFor="signin-email" className="label">
              <span className="label-text font-medium">ইমেইল</span>
            </label>

            <input
              id="signin-email"
              type="email"
              autoComplete="email"
              placeholder="আপনার ইমেইল লিখুন"
              className="input input-bordered w-full"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label htmlFor="signin-password" className="label">
              <span className="label-text font-medium">পাসওয়ার্ড</span>
            </label>

            <input
              id="signin-password"
              type="password"
              autoComplete="current-password"
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              className="input input-bordered w-full"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || socialLoading !== null}
            className="btn btn-primary w-full"
          >
            {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
          </button>
        </form>

        <div className="divider my-5 text-xs text-base-content/60">
          অথবা 
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleSocialSignIn("google")}
            disabled={loading || socialLoading !== null}
            className="btn btn-outline flex h-11 min-h-11 w-full flex-nowrap items-center justify-center gap-1 overflow-hidden px-1 text-[10px] font-medium normal-case sm:gap-1.5 sm:px-2 sm:text-xs"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
              aria-hidden="true"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                transform="translate(0 4)"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.62 5.91c4.45-4.11 7.14-10.17 7.14-17.56Z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
                transform="translate(0 4)"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.91-5.79l-7.62-5.91c-2.12 1.42-4.84 2.2-8.29 2.2-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
              />
            </svg>

            <span className="whitespace-nowrap">
              {socialLoading === "google"
                ? "অপেক্ষা করুন..."
                : "Google দিয়ে চালিয়ে যান"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignIn("github")}
            disabled={loading || socialLoading !== null}
            className="btn btn-outline flex h-11 min-h-11 w-full flex-nowrap items-center justify-center gap-1 overflow-hidden px-1 text-[10px] font-medium normal-case sm:gap-1.5 sm:px-2 sm:text-xs"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
              aria-hidden="true"
            >
              <path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.51-.29-5.15-1.26-5.15-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.44.11-3 0 0 .95-.3 3.1 1.16a10.8 10.8 0 0 1 5.64 0c2.15-1.46 3.1-1.16 3.1-1.16.62 1.56.23 2.71.11 3 .73.79 1.17 1.8 1.17 3.04 0 4.35-2.65 5.3-5.18 5.59.41.35.77 1.04.77 2.1v3.08c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z" />
            </svg>

            <span className="whitespace-nowrap">
              {socialLoading === "github"
                ? "অপেক্ষা করুন..."
                : "GitHub দিয়ে চালিয়ে যান"}
            </span>
          </button>
        </div>

        <p className="mt-6 text-center text-sm">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-primary hover:underline"
          >
            সাইন আপ করুন
          </Link>
        </p>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-base-content/70 hover:underline">
            ← হোমপেজে ফিরে যান
          </Link>
        </div>
      </section>
    </main>
  );
}
