import { NextResponse } from 'next/server'
import {
  checkAdminCredentials,
  createAdminSession,
} from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const email = body.email?.trim()
    const password = body.password

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      )
    }

    const valid = checkAdminCredentials(email, password)

    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid admin credentials.' },
        { status: 401 }
      )
    }

    await createAdminSession()

    return NextResponse.json({
      success: true,
      message: 'Login successful.',
    })
  } catch (error) {
    console.error('Admin login error:', error)

    return NextResponse.json(
      { error: 'Something went wrong during login.' },
      { status: 500 }
    )
  }
}