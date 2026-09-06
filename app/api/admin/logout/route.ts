import { NextResponse } from 'next/server'
import { logoutAdmin } from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function POST() {
  try {
    await logoutAdmin()

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Admin logout error:', error)

    return NextResponse.json(
      { error: 'Unable to logout.' },
      { status: 500 }
    )
  }
}