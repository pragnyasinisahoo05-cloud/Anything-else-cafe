'use client'

import { useState } from 'react'

type Reservation = {
  id: number
  name: string
  email: string
  phone: string | null
  date: string
  time: string
  guests: number
  special_request: string | null
  status: string
  created_at: string
}

type ReservationDetailsProps = {
  reservation: Reservation
}

export function ReservationDetails({
  reservation,
}: ReservationDetailsProps) {
  const [open, setOpen] = useState(false)

  const formattedStatus =
    reservation.status.charAt(0).toUpperCase() +
    reservation.status.slice(1)

  return (
    <>
      {/* Details Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary hover:shadow-sm"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
          <circle cx="12" cy="12" r="3" />
        </svg>

        Details
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-background p-6 shadow-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Reservation #{reservation.id}
                </p>

                <h2 className="mt-2 font-serif text-3xl text-foreground">
                  {reservation.name}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Booking details
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                aria-label="Close reservation details"
              >
                ×
              </button>
            </div>

            {/* Status */}
            <div className="mb-5 flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
              <span className="text-sm text-muted-foreground">
                Reservation status
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  reservation.status === 'confirmed'
                    ? 'bg-green-100 text-green-700'
                    : reservation.status === 'cancelled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {formattedStatus}
              </span>
            </div>

            {/* Reservation Info */}
            <div className="mb-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-card p-4">
                <p className="text-xs text-muted-foreground">
                  Date
                </p>

                <p className="mt-1 font-medium text-foreground">
                  {reservation.date}
                </p>
              </div>

              <div className="rounded-2xl bg-card p-4">
                <p className="text-xs text-muted-foreground">
                  Time
                </p>

                <p className="mt-1 font-medium text-foreground">
                  {reservation.time}
                </p>
              </div>

              <div className="rounded-2xl bg-card p-4">
                <p className="text-xs text-muted-foreground">
                  Guests
                </p>

                <p className="mt-1 font-medium text-foreground">
                  {reservation.guests}{' '}
                  {reservation.guests === 1
                    ? 'guest'
                    : 'guests'}
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="mb-5 rounded-2xl bg-card p-5">
              <p className="mb-4 text-sm font-medium text-foreground">
                Contact Information
              </p>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-foreground">
                    {reservation.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-medium text-foreground">
                    {reservation.phone || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Special Request */}
            <div className="mb-5 rounded-2xl bg-card p-5">
              <p className="text-xs text-muted-foreground">
                Special Request
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">
                {reservation.special_request ||
                  'No special request'}
              </p>
            </div>

            {/* Created */}
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">
                Created on {reservation.created_at}
              </p>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-5 w-full rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:-translate-y-0.5 hover:opacity-90"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  )
}