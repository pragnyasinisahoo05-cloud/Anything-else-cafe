import { NextResponse } from 'next/server'
import db from '@/lib/db'

export const runtime = 'nodejs'

const MAX_CAPACITY = 20
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

    // Validate basic types
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

    // Validate guests
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

    // Validate date/time format
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

    const reservationMinutes =
      timeToMinutes(time)

    const openingMinutes =
      OPENING_HOUR * 60

    const closingMinutes =
      CLOSING_HOUR * 60

    // Reservation must fit completely inside café hours
    if (
      reservationMinutes < openingMinutes ||
      reservationMinutes +
        RESERVATION_DURATION_MINUTES >
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

    if (
      Number.isNaN(
        reservationDateTime.getTime()
      )
    ) {
      return NextResponse.json(
        {
          error:
            'Invalid reservation date or time.',
        },
        { status: 400 }
      )
    }

    if (
      reservationDateTime <= new Date()
    ) {
      return NextResponse.json(
        {
          error:
            'Please choose a future date and time.',
        },
        { status: 400 }
      )
    }

    // Validate email
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (
      !emailPattern.test(
        email.trim()
      )
    ) {
      return NextResponse.json(
        {
          error:
            'Please enter a valid email address.',
        },
        { status: 400 }
      )
    }

    // Transaction protects capacity check + insertion
    const createReservation =
      db.transaction(() => {
        const requestedStart =
          reservationMinutes

        const requestedEnd =
          requestedStart +
          RESERVATION_DURATION_MINUTES

        const existingReservations =
          db
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

        for (
          const reservation
          of existingReservations
        ) {
          const existingStart =
            timeToMinutes(
              reservation.time
            )

          const existingEnd =
            existingStart +
            RESERVATION_DURATION_MINUTES

          const overlaps =
            requestedStart <
              existingEnd &&
            requestedEnd >
              existingStart

          if (overlaps) {
            bookedSeats +=
              reservation.guests
          }
        }

        // Capacity check
        if (
          bookedSeats + guestCount >
          MAX_CAPACITY
        ) {
          throw new Error(
            'NOT_ENOUGH_CAPACITY'
          )
        }

        // Prevent duplicate booking
        const duplicate =
          db
            .prepare(`
              SELECT id
              FROM reservations
              WHERE email = ?
                AND date = ?
                AND time = ?
                AND status != 'cancelled'
              LIMIT 1
            `)
            .get(
              email
                .trim()
                .toLowerCase(),
              date,
              time
            )

        if (duplicate) {
          throw new Error(
            'DUPLICATE_RESERVATION'
          )
        }

        // Insert reservation
        const result =
          db
            .prepare(`
              INSERT INTO reservations (
                name,
                email,
                phone,
                date,
                time,
                guests,
                special_request,
                status
              )
              VALUES (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                'pending'
              )
            `)
            .run(
              name.trim(),
              email
                .trim()
                .toLowerCase(),
              typeof phone ===
                'string'
                ? phone.trim()
                : null,
              date,
              time,
              guestCount,
              typeof special_request ===
                'string'
                ? special_request.trim()
                : null
            )

        return result.lastInsertRowid
      })

    let reservationId:
      | number
      | bigint

    try {
      reservationId =
        createReservation()
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
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
        error instanceof Error &&
        error.message ===
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

      throw error
    }

    return NextResponse.json(
      {
        success: true,
        message:
          'Reservation submitted successfully.',
        reservationId:
          Number(reservationId),
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