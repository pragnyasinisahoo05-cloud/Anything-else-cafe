import { NextResponse } from 'next/server'
import db from '@/lib/db'

export const runtime = 'nodejs'

const MAX_CAPACITY = 20
const RESERVATION_DURATION_MINUTES = 90

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const date = searchParams.get('date')
    const time = searchParams.get('time')

    // Basic validation
    if (!date || !time) {
      return NextResponse.json(
        {
          error: 'Date and time are required.',
        },
        { status: 400 }
      )
    }

    // Validate time
    const [hours, minutes] = time.split(':').map(Number)

    if (
      !Number.isInteger(hours) ||
      !Number.isInteger(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return NextResponse.json(
        {
          error: 'Invalid time.',
        },
        { status: 400 }
      )
    }

    // Validate café hours
    if (hours < 8 || hours > 18) {
      return NextResponse.json(
        {
          error:
            'Reservations are available between 08:00 and 18:00.',
        },
        { status: 400 }
      )
    }

    const requestedStart = hours * 60 + minutes

    const requestedEnd =
      requestedStart + RESERVATION_DURATION_MINUTES

    // Get active reservations for this date
    const existingBookings = db
      .prepare(`
        SELECT time, guests
        FROM reservations
        WHERE date = ?
          AND status != 'cancelled'
      `)
      .all(date) as {
      time: string
      guests: number
    }[]

    let bookedSeats = 0

    // Count only reservations overlapping this time
    for (const booking of existingBookings) {
      const [bookingHours, bookingMinutes] =
        booking.time.split(':').map(Number)

      const bookingStart =
        bookingHours * 60 + bookingMinutes

      const bookingEnd =
        bookingStart + RESERVATION_DURATION_MINUTES

      const overlaps =
        requestedStart < bookingEnd &&
        requestedEnd > bookingStart

      if (overlaps) {
        bookedSeats += booking.guests
      }
    }

    const availableSeats = Math.max(
      0,
      MAX_CAPACITY - bookedSeats
    )

    return NextResponse.json({
      success: true,
      date,
      time,
      capacity: MAX_CAPACITY,
      bookedSeats,
      availableSeats,
      available: availableSeats > 0,
    })
  } catch (error) {
    console.error('Availability error:', error)

    return NextResponse.json(
      {
        error: 'Unable to check availability.',
      },
      { status: 500 }
    )
  }
}