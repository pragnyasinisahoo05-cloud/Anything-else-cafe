'use client'

import { ReservationActions } from './reservation-actions'
import { ReservationDetails } from './reservation-details'

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

type Props = {
  reservation: Reservation
}

export function MobileReservationCard({
  reservation,
}: Props) {
  const formattedStatus =
    reservation.status.charAt(0).toUpperCase() +
    reservation.status.slice(1)

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-medium text-foreground">
            {reservation.name}
          </h3>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Reservation #{reservation.id}
          </p>
        </div>

        {/* Status */}
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
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

      {/* Date / Time / Guests */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        
        <div className="rounded-xl bg-secondary p-3">
          <p className="text-[11px] text-muted-foreground">
            Date
          </p>

          <p className="mt-1 text-sm font-medium text-foreground">
            {reservation.date}
          </p>
        </div>

        <div className="rounded-xl bg-secondary p-3">
          <p className="text-[11px] text-muted-foreground">
            Time
          </p>

          <p className="mt-1 text-sm font-medium text-foreground">
            {reservation.time}
          </p>
        </div>

        <div className="rounded-xl bg-secondary p-3">
          <p className="text-[11px] text-muted-foreground">
            Guests
          </p>

          <p className="mt-1 text-sm font-medium text-foreground">
            {reservation.guests}
          </p>
        </div>

      </div>

      {/* Contact */}
      <div className="mt-4 space-y-1.5">
        <p className="break-all text-sm text-foreground">
          {reservation.email}
        </p>

        {reservation.phone && (
          <p className="text-sm text-muted-foreground">
            {reservation.phone}
          </p>
        )}
      </div>

      {/* Special Request */}
      {reservation.special_request && (
        <div className="mt-4 rounded-xl border border-border px-3 py-2.5">
          <p className="text-[11px] text-muted-foreground">
            Special request
          </p>

          <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
            {reservation.special_request}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-4">
        
        <ReservationDetails
          reservation={reservation}
        />

        <ReservationActions
          id={reservation.id}
          status={reservation.status}
        />

      </div>
    </div>
  )
}