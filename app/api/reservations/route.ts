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

    // Required fields
    if (
      !name ||
      !email ||
      !date ||
      !time ||
      guests === undefined
    ) {
      return NextResponse.json(
        {
          error: 'Please fill in all required fields.',
        },
        { status: 400 }
      )
    }

    // Basic type validation
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof date !== 'string' ||
      typeof time !== 'string'
    ) {
      return NextResponse.json(
        {
          error: 'Invalid reservation data.',
        },
        { status: 400 }
      )
    }

    // Guest validation
    const guestCount = Number(guests)

    if (
      !Number.isInteger(guestCount) ||
      guestCount < 1 ||
      guestCount > 8
    ) {
      return NextResponse.json(
        {
          error: 'Guests must be between 1 and 8.',
        },
        { status: 400 }
      )
    }

    // Date/time format
    if (
      !isValidDate(date) ||
      !isValidTime(time)
    ) {
      return NextResponse.json(
        {
          error: 'Invalid date or time.',
        },
        { status: 400 }
      )
    }

    const reservationMinutes = timeToMinutes(time)

    const openingMinutes = OPENING_HOUR * 60
    const closingMinutes = CLOSING_HOUR * 60

    // Reservation must completely fit inside café hours
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

    // Make sure reservation is in the future
    const reservationDateTime = new Date(
      `${date}T${time}:00`
    )

    if (Number.isNaN(reservationDateTime.getTime())) {
      return NextResponse.json(
        {
          error: 'Invalid reservation date or time.',
        },
        { status: 400 }
      )
    }

    if (reservationDateTime <= new Date()) {
      return NextResponse.json(
        {
          error: 'Please choose a future date and time.',
        },
        { status: 400 }
      )
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const normalizedEmail = email.trim().toLowerCase()

    if (!emailPattern.test(normalizedEmail)) {
      return NextResponse.json(
        {
          error: 'Please enter a valid email address.',
        },
        { status: 400 }
      )
    }

    // Normalize optional fields
    const normalizedName = name.trim()

    const normalizedPhone =
      typeof phone === 'string'
        ? phone.trim()
        : null

    const normalizedSpecialRequest =
      typeof special_request === 'string'
        ? special_request.trim()
        : null

    /*
      Supabase RPC handles:

      1. Capacity check
      2. Duplicate reservation check
      3. Reservation insertion
      4. Transaction/concurrency protection
    */
    const { data, error } = await db.rpc(
      'create_reservation',
      {
        p_name: normalizedName,
        p_email: normalizedEmail,
        p_phone: normalizedPhone,
        p_date: date,
        p_time: time,
        p_guests: guestCount,
        p_special_request: normalizedSpecialRequest,
      }
    )

    if (error) {
      console.error(
        'Supabase reservation RPC error:',
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

    // RPC returns JSON:
    // { success: true, reservationId: ... }
    // OR
    // { success: false, code: 'NOT_ENOUGH_CAPACITY' }
    // OR
    // { success: false, code: 'DUPLICATE_RESERVATION' }

    if (!data?.success) {
      if (
        data?.code ===
        'NOT_ENOUGH_CAPACITY'
      ) {
        return NextResponse.json(
          {
            error:
              'Sorry, there are not enough seats available for this time.',
          },
          { status: 409 }
        )
      }

      if (
        data?.code ===
        'DUPLICATE_RESERVATION'
      ) {
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
          error:
            'Unable to create reservation. Please try again.',
        },
        { status: 500 }
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