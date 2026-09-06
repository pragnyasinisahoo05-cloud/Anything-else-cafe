
import type { Metadata, Viewport } from 'next'
import { Fraunces, Geist } from 'next/font/google'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
})

export const metadata: Metadata = {
  title: 'Anything Else — Specialty Coffee & Roastery',
  description:
    'Anything Else is a specialty coffee roastery and café serving thoughtfully sourced beans, house-made pastries, and a warm place to slow down.',
  generator: 'v0.app',
  keywords: ['café', 'coffee', 'roastery', 'espresso', 'specialty coffee', 'Anything Else'],
  openGraph: {
    title: 'Anything Else — Specialty Coffee & Roastery',
    description:
      'A specialty coffee roastery and café serving thoughtfully sourced beans and house-made pastries.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#efe7d6',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${fraunces.variable} bg-background`}>
      <body className="font-sans antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
