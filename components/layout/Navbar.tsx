
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const categories = [
  { slug: "chal", name: "চাল", icon: "🍚" },
  { slug: "dal", name: "ডাল", icon: "🫘" },
  { slug: "tel", name: "তেল", icon: "🛢️" },
  { slug: "sobji", name: "সবজি", icon: "🥬" },
  { slug: "mach", name: "মাছ", icon: "🐟" },
  { slug: "mangsho", name: "মাংস", icon: "🍗" },
  { slug: "dim-dui", name: "ডিম-দুধ", icon: "🥛" },
  { slug: "mosla", name: "মসলা", icon: "🌶️" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [date, setDate] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDate = () => {
      setDate(
        new Intl.DateTimeFormat("bn-BD", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Dhaka",
        }).format(new Date())
      );
    };

    updateDate();

    const interval = setInterval(updateDate, 60_000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(result.error.message || "সাইন আউট করা যায়নি।");
        return;
      }

      setMenuOpen(false);
      toast.success("সফলভাবে সাইন আউট হয়েছে।");
      window.location.replace("/");
    } catch (error) {
      console.error("Sign out failed:", error);
      toast.error("সাইন আউট করতে সমস্যা হয়েছে।");
    } finally {
      setSigningOut(false);
    }
  }

  const user = session?.user;
  const userName = user?.name?.trim() || "ব্যবহারকারী";
  const userEmail = user?.email || "";

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex min-h-[82px] items-center justify-between gap-3 py-3">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3"
            aria-label="বাজার দর হোমপেজ"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl">
              🛒
            </span>

            <span className="min-w-0">
              <span className="block text-xl font-black tracking-tight text-base-content sm:text-2xl">
                বাজার দর
              </span>

              <span className="mt-1 block text-xs text-base-content/60 sm:text-sm">
                {date || "প্রতিদিনের বাজারদর"}
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            {isPending ? (
              <span className="loading loading-spinner loading-sm text-primary" />
            ) : user ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  aria-label="ব্যবহারকারীর মেনু"
                  className="flex max-w-[220px] items-center gap-2 rounded-full border border-base-300 bg-base-100 p-1.5 pr-3 transition-colors hover:bg-base-200 sm:gap-3"
                >
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="h-9 w-9 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg">
                      👤
                    </span>
                  )}

                  <span className="min-w-0 text-left">
                    <span className="block truncate text-sm font-semibold">
                      {userName}
                    </span>
                    <span className="hidden max-w-32 truncate text-xs text-base-content/60 sm:block">
                      {userEmail}
                    </span>
                  </span>

                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      menuOpen ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      d="m5 7.5 5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-2 w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-2 shadow-xl"
                  >
                    <div className="border-b border-base-200 px-3 py-3">
                      <p className="truncate text-sm font-bold">
                        {userName}
                      </p>
                      <p className="mt-1 break-all text-xs text-base-content/60">
                        {userEmail}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-base-200"
                    >
                      <span className="text-lg" aria-hidden="true">
                        👤
                      </span>
                      আমার প্রোফাইল
                    </Link>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-error transition-colors hover:bg-error/10 disabled:opacity-60"
                    >
                      <span className="text-lg" aria-hidden="true">
                        ↩
                      </span>
                      {signingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="btn btn-ghost btn-sm sm:btn-md"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/sign-up"
                  className="btn btn-primary btn-sm sm:btn-md"
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>

        <nav
          aria-label="পণ্যের ক্যাটাগরি"
          className="-mx-4 overflow-x-auto border-t border-base-200 px-4"
        >
          <div className="flex min-w-max items-center gap-1 py-2">
            {categories.map((category) => {
              const href = `/category/${category.slug}`;
              const isActive =
                pathname === href || pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={category.slug}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors sm:px-4 ${
                    isActive
                      ? "bg-primary text-primary-content shadow-sm"
                      : "text-base-content/75 hover:bg-base-200 hover:text-base-content"
                  }`}
                >
                  <span className="text-lg" aria-hidden="true">
                    {category.icon}
                  </span>
                  <span>{category.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
