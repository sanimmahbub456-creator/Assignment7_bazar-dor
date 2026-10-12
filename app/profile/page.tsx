
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
    }
  }, [session?.user?.name]);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/sign-in");
    }
  }, [isPending, session?.user, router]);

  async function handleUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const updatedName = name.trim();

    if (!updatedName) {
      toast.error("আপনার নাম লিখুন।");
      return;
    }

    if (updatedName.length > 100) {
      toast.error("নাম সর্বোচ্চ ১০০ অক্ষরের হতে পারবে।");
      return;
    }

    setSaving(true);

    try {
      const result = await authClient.updateUser({
        name: updatedName,
      });

      if (result.error) {
        toast.error(
          result.error.message || "নাম আপডেট করা যায়নি।"
        );
        return;
      }

      setName(updatedName);
      toast.success("আপনার নাম সফলভাবে আপডেট হয়েছে।");
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("আপডেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(
          result.error.message || "সাইন আউট করা যায়নি।"
        );
        setSigningOut(false);
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে।");
      window.location.replace("/");
    } catch (error) {
      console.error("Sign out failed:", error);
      toast.error("সাইন আউট করতে সমস্যা হয়েছে।");
      setSigningOut(false);
    }
  }

  if (isPending || !session?.user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-6">
        <span className="loading loading-spinner loading-lg" />
        <span className="ml-3">প্রোফাইল লোড হচ্ছে...</span>
      </main>
    );
  }

  const user = session.user;

  return (
    <main className="min-h-[75vh] bg-base-200 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold">
            আমার প্রোফাইল
          </h1>
          <p className="mt-2 text-base-content/70">
            আপনার অ্যাকাউন্টের তথ্য দেখুন এবং নাম আপডেট করুন।
          </p>
        </header>

        <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
          <div className="flex flex-col gap-5 border-b border-base-300 p-6 sm:flex-row sm:items-center">
            {user.image ? (
              <Image
                src={user.image}
                alt={`${user.name || "User"} profile`}
                width={72}
                height={72}
                unoptimized
                referrerPolicy="no-referrer"
                className="h-[72px] w-[72px] rounded-full object-cover"
              />
            ) : (
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-base-200 text-3xl">
                👤
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h2 className="break-words text-xl font-bold">
                {user.name || "ব্যবহারকারী"}
              </h2>
              <p className="mt-1 break-all text-sm text-base-content/70">
                {user.email}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="btn btn-outline btn-error btn-sm"
            >
              {signingOut ? "সাইন আউট হচ্ছে..." : "↩ সাইন আউট"}
            </button>
          </div>

          <div className="p-6">
            <h3 className="mb-5 text-lg font-bold">
              অ্যাকাউন্টের তথ্য
            </h3>

            <div className="mb-5">
              <label
                htmlFor="profile-email"
                className="mb-2 block text-sm font-medium"
              >
                ইমেইল
              </label>

              <input
                id="profile-email"
                type="email"
                value={user.email}
                readOnly
                className="input input-bordered w-full bg-base-200"
              />

              <p className="mt-1 text-xs text-base-content/60">
                নিরাপত্তার জন্য এই পেজে ইমেইল পরিবর্তন করা যাবে না।
              </p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label
                  htmlFor="profile-name"
                  className="mb-2 block text-sm font-medium"
                >
                  নাম
                </label>

                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={100}
                  placeholder="আপনার নাম লিখুন"
                  autoComplete="name"
                  className="input input-bordered w-full"
                />
              </div>

              <button
                type="submit"
                disabled={
                  saving || name.trim() === (user.name || "")
                }
                className="btn btn-primary w-full sm:w-auto"
              >
                {saving ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    আপডেট হচ্ছে...
                  </>
                ) : (
                  "তথ্য আপডেট করুন"
                )}
              </button>
            </form>
          </div>
        </section>

        <div className="mt-6">
          <Link href="/" className="btn btn-outline btn-sm">
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}
