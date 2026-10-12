export default function CategoryLoading() {
  return (
    <main className="min-h-screen bg-base-200/40 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="h-7 w-36 animate-pulse rounded bg-base-300" />

        <div className="mt-6 flex items-center gap-4 rounded-3xl border border-base-300 bg-base-100 p-6">
          <div className="h-16 w-16 animate-pulse rounded-2xl bg-base-200" />

          <div className="flex-1">
            <div className="h-6 w-48 animate-pulse rounded bg-base-300" />
            <div className="mt-3 h-4 w-32 animate-pulse rounded bg-base-200" />
          </div>
        </div>

        <p className="mt-8 text-sm text-base-content/60">
          পণ্য লোড হচ্ছে…
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-base-300 bg-base-100 p-4"
            >
              <div className="h-24 rounded-xl bg-base-200" />
              <div className="mt-4 h-4 w-3/4 rounded bg-base-300" />
              <div className="mt-3 h-4 w-1/2 rounded bg-base-200" />
              <div className="mt-5 h-6 w-2/3 rounded bg-base-300" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}