export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8">
        <div className="skeleton h-10 w-64" />
        <div className="skeleton mt-3 h-5 w-96" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border bg-base-100 p-5"
          >
            <div className="skeleton h-24 w-full" />
            <div className="skeleton mt-5 h-6 w-3/4" />
            <div className="skeleton mt-3 h-4 w-1/2" />
            <div className="skeleton mt-6 h-8 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}