import { NextResponse } from 'next/server'
import db from '@/lib/db'

export const runtime = 'nodejs'

const RESERVATION_DURATION_MINUTES = 90
const OPENING_HOUR = 8
const CLOSING_HOUR = 18

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function isValidDate(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date)
}

function isValidTime(time: string) {
  return /^\d{2}:\d{2}$/.test(time)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      name,
      email,
      phone,
      date,
      time,
      guests,
      special_request,
    } = body

    if (
      !name ||
      !email ||
      !date ||
      !time ||
      guests === undefined
    ) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      )
    }

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof date !== 'string' ||
      typeof time !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Invalid reservation data.' },
        { status: 400 }
      )
    }

    const guestCount = Number(guests)

    if (
      !Number.isInteger(guestCount) ||
      guestCount < 1 ||
      guestCount > 8
    ) {
      return NextResponse.json(
        { error: 'Guests must be between 1 and 8.' },
        { status: 400 }
      )
    }

    if (!isValidDate(date) || !isValidTime(time)) {
      return NextResponse.json(
        { error: 'Invalid date or time.' },
        { status: 400 }
      )
    }

    const reservationMinutes = timeToMinutes(time)

    const openingMinutes = OPENING_HOUR * 60
    const closingMinutes = CLOSING_HOUR * 60

    if (
      reservationMinutes < openingMinutes ||
      reservationMinutes + RESERVATION_DURATION_MINUTES >
        closingMinutes
    ) {
      return NextResponse.json(
        {
          error:
            'Reservations are available between 08:00 and 16:30.',
        },
        { status: 400 }
      )
    }

    const reservationDateTime = new Date(
      `${date}T${time}:00`
    )

    if (
      Number.isNaN(reservationDateTime.getTime())
    ) {
      return NextResponse.json(
        {
          error:
            'Invalid reservation date or time.',
        },
        { status: 400 }
      )
    }

    if (reservationDateTime <= new Date()) {
      return NextResponse.json(
        {
          error:
            'Please choose a future date and time.',
        },
        { status: 400 }
      )
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(email.trim())) {
      return NextResponse.json(
        {
          error:
            'Please enter a valid email address.',
        },
        { status: 400 }
      )
    }

    const { data, error } = await db.rpc(
      'create_reservation',
      {
        p_name: name.trim(),
        p_email: email.trim().toLowerCase(),
        p_phone:
          typeof phone === 'string'
            ? phone.trim()
            : null,
        p_date: date,
        p_time: time,
        p_guests: guestCount,
        p_special_request:
          typeof special_request === 'string'
            ? special_request.trim()
            : null,
      }
    )

    if (error) {
      console.error(
        'Supabase reservation error:',
        error
      )

      return NextResponse.json(
        {
          error:
            'Unable to create reservation. Please try again.',
        },
        { status: 500 }
      )
    }

    if (data?.code === 'NOT_ENOUGH_CAPACITY') {
      return NextResponse.json(
        {
          error:
            'Sorry, there are not enough seats available for this time.',
        },
        { status: 409 }
      )
    }

    if (data?.code === 'DUPLICATE_RESERVATION') {
      return NextResponse.json(
        {
          error:
            'A reservation with this email, date and time already exists.',
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message:
          'Reservation submitted successfully.',
        reservationId: Number(
          data.reservationId
        ),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error(
      'Reservation creation error:',
      error
    )

    return NextResponse.json(
      {
        error:
          'Unable to create reservation. Please try again.',
      },
      { status: 500 }
    )
  }
}