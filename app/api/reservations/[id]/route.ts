import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAdminAuthenticated()

    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized.' },
        { status: 401 }
      )
    }

    const { id } = await params
    const reservationId = Number(id)

    if (!Number.isInteger(reservationId) || reservationId <= 0) {
      return NextResponse.json(
        { error: 'Invalid reservation ID.' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const status = body.status

    if (!['confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid reservation status.' },
        { status: 400 }
      )
    }

    const result = db
      .prepare(`
        UPDATE reservations
        SET status = ?
        WHERE id = ?
      `)
      .run(status, reservationId)

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Reservation not found.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Reservation ${status}.`,
    })
  } catch (error) {
    console.error('Reservation status update error:', error)

    return NextResponse.json(
      { error: 'Unable to update reservation.' },
      { status: 500 }
    )
  }
}