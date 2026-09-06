'use client'

import { useRouter, useSearchParams } from 'next/navigation'

type ReservationsPaginationProps = {
  currentPage: number
  totalPages: number
  totalReservations: number
  pageSize: number
}

export function ReservationsPagination({
  currentPage,
  totalPages,
  totalReservations,
  pageSize,
}: ReservationsPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return

    const params = new URLSearchParams(
      searchParams.toString()
    )

    params.set('page', String(page))

    router.push(
      `/admin/reservations?${params.toString()}`
    )
  }

  function changePageSize(size: string) {
    const params = new URLSearchParams(
      searchParams.toString()
    )

    params.set('pageSize', size)
    params.set('page', '1')

    router.push(
      `/admin/reservations?${params.toString()}`
    )
  }

  if (totalReservations === 0) {
    return null
  }

  const start =
    (currentPage - 1) * pageSize + 1

  const end = Math.min(
    currentPage * pageSize,
    totalReservations
  )

  const visiblePages: number[] = []

  const startPage = Math.max(
    1,
    currentPage - 2
  )

  const endPage = Math.min(
    totalPages,
    currentPage + 2
  )

  for (
    let page = startPage;
    page <= endPage;
    page++
  ) {
    visiblePages.push(page)
  }

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-card p-5 sm:flex-row sm:items-center sm:justify-between">

      {/* Results info */}

      <div className="text-sm text-muted-foreground">
        Showing{' '}
        <span className="font-medium text-foreground">
          {start}
        </span>
        {' '}–{' '}
        <span className="font-medium text-foreground">
          {end}
        </span>
        {' '}of{' '}
        <span className="font-medium text-foreground">
          {totalReservations}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">

        {/* Page size */}

        <select
          value={String(pageSize)}
          onChange={(e) =>
            changePageSize(e.target.value)
          }
          className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          aria-label="Reservations per page"
        >
          <option value="10">
            10 / page
          </option>

          <option value="25">
            25 / page
          </option>

          <option value="50">
            50 / page
          </option>
        </select>

        {/* Previous */}

        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() =>
            goToPage(currentPage - 1)
          }
          className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Previous
        </button>

        {/* Page numbers */}

        {visiblePages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => goToPage(page)}
            className={`h-9 min-w-9 rounded-xl px-3 text-sm font-medium transition ${
              page === currentPage
                ? 'bg-foreground text-background'
                : 'border border-border text-foreground hover:bg-secondary'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next */}

        <button
          type="button"
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            goToPage(currentPage + 1)
          }
          className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next →
        </button>

      </div>

    </div>
  )
}