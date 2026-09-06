'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function ReservationsSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSearch = searchParams.get('search') || ''
  const [search, setSearch] = useState(currentSearch)

  function handleSearch(value: string) {
    setSearch(value)

    const params = new URLSearchParams(searchParams.toString())

    if (value.trim()) {
      params.set('search', value.trim())
    } else {
      params.delete('search')
    }

    router.push(`/admin/reservations?${params.toString()}`)
  }

  return (
    <div className="mb-6 rounded-2xl bg-card p-5">
      <label
        htmlFor="reservation-search"
        className="mb-2 block text-sm font-medium text-foreground"
      >
        Search reservations
      </label>

      <div className="relative">
        <input
          id="reservation-search"
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name, email or phone..."
          className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring"
        />

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          🔍
        </span>
      </div>
    </div>
  )
}