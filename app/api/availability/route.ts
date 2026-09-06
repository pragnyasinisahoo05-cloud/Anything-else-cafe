import { NextResponse } from 'next/server'
import db from '@/lib/db'

export const runtime = 'nodejs'

const MAX_CAPACITY = 20
const RESERVATION_DURATION_MINUTES = 90

export async function GET(request: Request) {
  try {
    const { searchParams } =
      new URL(request.url)

    const date =
      searchParams.get('date')

    const time =
      searchParams.get('time')

    if (!date || !time) {
      return NextResponse.json(
        {
          error:
            'Date and time are required.',
        },
        { status: 400 }
      )
    }

    const [hours, minutes] =
      time.split(':').map(Number)

    if (
      !Number.isInteger(hours) ||
      !Number.isInteger(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return NextResponse.json(
        { error: 'Invalid time.' },
        { status: 400 }
      )
    }

    if (hours < 8 || hours > 18) {
      return NextResponse.json(
        {
          error:
            'Reservations are available between 08:00 and 18:00.',
        },
        { status: 400 }
      )
    }

    const requestedStart =
      hours * 60 + minutes

    const requestedEnd =
      requestedStart +
      RESERVATION_DURATION_MINUTES

    const { data, error } =
      await db
        .from('reservations')
        .select('time, guests')
        .eq('date', date)
        .neq('status', 'cancelled')

    if (error) {
      console.error(
        'Availability database error:',
        error
      )

      return NextResponse.json(
        {
          error:
            'Unable to check availability.',
        },
        { status: 500 }
      )
    }

    let bookedSeats = 0

    for (const booking of data ?? []) {
      const [
        bookingHours,
        bookingMinutes,
      ] = booking.time
        .split(':')
        .map(Number)

      const bookingStart =
        bookingHours * 60 +
        bookingMinutes

      const bookingEnd =
        bookingStart +
        RESERVATION_DURATION_MINUTES

      const overlaps =
        requestedStart < bookingEnd &&
        requestedEnd > bookingStart

      if (overlaps) {
        bookedSeats += booking.guests
      }
    }

    const availableSeats =
      Math.max(
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
      available:
        availableSeats > 0,
    })
  } catch (error) {
    console.error(
      'Availability error:',
      error
    )

    return NextResponse.json(
      {
        error:
          'Unable to check availability.',
      },
      { status: 500 }
    )
  }
}