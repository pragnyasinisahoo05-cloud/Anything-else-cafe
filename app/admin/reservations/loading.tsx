export default function Loading() {
  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="h-4 w-32 animate-pulse rounded bg-secondary" />

            <div className="mt-3 h-10 w-64 animate-pulse rounded bg-secondary" />

            <div className="mt-3 h-4 w-80 animate-pulse rounded bg-secondary" />
          </div>

          <div className="h-10 w-24 animate-pulse rounded-xl bg-secondary" />
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl bg-card p-6"
            >
              <div className="h-4 w-20 animate-pulse rounded bg-secondary" />

              <div className="mt-3 h-9 w-14 animate-pulse rounded bg-secondary" />

              <div className="mt-2 h-3 w-28 animate-pulse rounded bg-secondary" />
            </div>
          ))}
        </div>

        {/* Guest Trend */}
        <div className="mb-8 rounded-3xl bg-card p-6">
          <div className="h-7 w-40 animate-pulse rounded bg-secondary" />

          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-secondary" />

          <div className="mt-8 flex h-64 items-end justify-between gap-4">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="flex h-full flex-1 items-end justify-center"
              >
                <div
                  className="w-full max-w-12 animate-pulse rounded-t-xl bg-secondary"
                  style={{
                    height: `${30 + index * 8}%`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Analytics */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">

          <div className="rounded-3xl bg-card p-6">
            <div className="h-7 w-48 animate-pulse rounded bg-secondary" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-secondary" />

            <div className="mt-8 space-y-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index}>
                  <div className="mb-2 flex justify-between">
                    <div className="h-4 w-20 animate-pulse rounded bg-secondary" />
                    <div className="h-4 w-16 animate-pulse rounded bg-secondary" />
                  </div>

                  <div className="h-3 animate-pulse rounded-full bg-secondary" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-card p-6">
            <div className="h-7 w-40 animate-pulse rounded bg-secondary" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-secondary" />

            <div className="mt-8 space-y-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index}>
                  <div className="mb-2 flex justify-between">
                    <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
                    <div className="h-4 w-16 animate-pulse rounded bg-secondary" />
                  </div>

                  <div className="h-3 animate-pulse rounded-full bg-secondary" />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl bg-card p-5">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <div className="mb-2 h-4 w-20 animate-pulse rounded bg-secondary" />
                <div className="h-12 w-full animate-pulse rounded-xl bg-secondary" />
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 rounded-2xl bg-card p-5">
          <div className="mb-2 h-4 w-40 animate-pulse rounded bg-secondary" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-secondary" />
        </div>

        {/* Reservations */}
        <div className="overflow-hidden rounded-3xl bg-card">

          {/* Desktop skeleton */}
          <div className="hidden md:block">
            <div className="grid grid-cols-8 gap-4 border-b border-border px-6 py-5">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-4 animate-pulse rounded bg-secondary"
                />
              ))}
            </div>

            {Array.from({ length: 6 }).map((_, row) => (
              <div
                key={row}
                className="grid grid-cols-8 gap-4 border-b border-border px-6 py-6"
              >
                {Array.from({ length: 8 }).map((_, col) => (
                  <div
                    key={col}
                    className="h-4 animate-pulse rounded bg-secondary"
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Mobile skeleton */}
          <div className="space-y-4 p-4 md:hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-5 w-32 animate-pulse rounded bg-secondary" />
                    <div className="mt-2 h-3 w-24 animate-pulse rounded bg-secondary" />
                  </div>

                  <div className="h-7 w-20 animate-pulse rounded-full bg-secondary" />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {Array.from({ length: 3 }).map((_, box) => (
                    <div
                      key={box}
                      className="h-16 animate-pulse rounded-xl bg-secondary"
                    />
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  <div className="h-4 w-48 animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </main>
  )
}