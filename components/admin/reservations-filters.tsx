'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function ReservationFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentStatus =
    searchParams.get('status') || 'all'

  const currentDate =
    searchParams.get('date') || ''

  const currentPeriod =
    searchParams.get('period') || 'all'

  const currentSearch =
    searchParams.get('search') || ''

  function updateFilters(
    status: string,
    date: string,
    period: string
  ) {
    const params = new URLSearchParams()

    if (status !== 'all') {
      params.set('status', status)
    }

    if (date) {
      params.set('date', date)
    }

    if (period !== 'all') {
      params.set('period', period)
    }

    // Preserve search
    if (currentSearch) {
      params.set('search', currentSearch)
    }

    const query = params.toString()

    router.push(
      query
        ? `/admin/reservations?${query}`
        : '/admin/reservations'
    )
  }

  function clearFilters() {
    router.push('/admin/reservations')
  }

  return (
    <div className="mb-6 rounded-2xl bg-card p-5">

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Status
          </label>

          <select
            id="status"
            value={currentStatus}
            onChange={(e) =>
              updateFilters(
                e.target.value,
                currentDate,
                currentPeriod
              )
            }
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">
              All reservations
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="confirmed">
              Confirmed
            </option>

            <option value="cancelled">
              Cancelled
            </option>
          </select>
        </div>

        {/* Quick period */}
        <div>
          <label
            htmlFor="period"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Quick date
          </label>

          <select
            id="period"
            value={currentPeriod}
            onChange={(e) =>
              updateFilters(
                currentStatus,
                '',
                e.target.value
              )
            }
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">
              All dates
            </option>

            <option value="today">
              Today
            </option>

            <option value="upcoming">
              Upcoming
            </option>

            <option value="past">
              Past
            </option>
          </select>
        </div>

        {/* Exact date */}
        <div>
          <label
            htmlFor="date"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Specific date
          </label>

          <input
            id="date"
            type="date"
            value={currentDate}
            onChange={(e) =>
              updateFilters(
                currentStatus,
                e.target.value,
                'all'
              )
            }
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Clear */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={clearFilters}
            className="w-full rounded-xl border border-border px-5 py-3 text-sm font-medium text-foreground transition hover:bg-secondary"
          >
            Clear filters
          </button>
        </div>

      </div>

      {/* Active filters */}
      {(currentStatus !== 'all' ||
        currentDate ||
        currentPeriod !== 'all' ||
        currentSearch) && (
        <div className="mt-4 flex flex-wrap gap-2">

          {currentStatus !== 'all' && (
            <span className="rounded-full bg-secondary px-3 py-1 text-xs text-foreground">
              Status: {currentStatus}
            </span>
          )}

          {currentPeriod !== 'all' && (
            <span className="rounded-full bg-secondary px-3 py-1 text-xs capitalize text-foreground">
              Date: {currentPeriod}
            </span>
          )}

          {currentDate && (
            <span className="rounded-full bg-secondary px-3 py-1 text-xs text-foreground">
              Date: {currentDate}
            </span>
          )}

          {currentSearch && (
            <span className="rounded-full bg-secondary px-3 py-1 text-xs text-foreground">
              Search: {currentSearch}
            </span>
          )}

        </div>
      )}

    </div>
  )
}