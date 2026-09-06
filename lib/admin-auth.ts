import crypto from 'crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'admin_session'

function createToken() {
  const timestamp = Date.now().toString()

  const secret = process.env.ADMIN_SESSION_SECRET

  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is not configured')
  }

  const signature = crypto
    .createHmac('sha256', secret)
    .update(timestamp)
    .digest('hex')

  return `${timestamp}.${signature}`
}

function verifyToken(token: string) {
  const secret = process.env.ADMIN_SESSION_SECRET

  if (!secret) {
    return false
  }

  const [timestamp, signature] = token.split('.')

  if (!timestamp || !signature) {
    return false
  }

  const age = Date.now() - Number(timestamp)

  // Session expires after 8 hours
  if (!Number.isFinite(age) || age < 0 || age > 8 * 60 * 60 * 1000) {
    return false
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(timestamp)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

export function checkAdminCredentials(
  email: string,
  password: string
) {
  return (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  )
}

export async function createAdminSession() {
  const cookieStore = await cookies()

  cookieStore.set(COOKIE_NAME, createToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 8 * 60 * 60,
  })
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) {
    return false
  }

  return verifyToken(token)
}

export async function logoutAdmin() {
  const cookieStore = await cookies()

  cookieStore.delete(COOKIE_NAME)
}