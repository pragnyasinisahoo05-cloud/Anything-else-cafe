'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navLinks } from '@/lib/site'
import { Logo } from '@/components/logo'

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-border/60 bg-background/85 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link href="/" aria-label={`${'Anything Else'} home`} className="relative z-10">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'link-underline text-sm tracking-wide transition-colors',
                    active
                      ? 'text-foreground'
                      : 'text-foreground/65 hover:text-foreground',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="hidden md:block">
          <Link
            href="/reservation"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
          >
            <span className="relative z-10">Reserve a table</span>
            <span className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
            <span className="relative z-10 hidden text-accent-foreground group-hover:inline">
              &rarr;
            </span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-foreground md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 z-0 flex flex-col bg-background px-6 pb-10 pt-24 transition-all duration-500 md:hidden',
          open
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none -translate-y-4 opacity-0',
        )}
      >
        <ul className="flex flex-col gap-2">
          {navLinks.map((link, i) => (
            <li
              key={link.href}
              className={cn(
                'transition-all duration-500',
                open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
              )}
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : '0ms' }}
            >
              <Link
                href={link.href}
                className={cn(
                  'block border-b border-border/60 py-4 font-serif text-3xl',
                  pathname === link.href ? 'text-accent' : 'text-foreground',
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/reservation"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-6 py-4 text-base font-medium text-primary-foreground"
        >
          Reserve a table
        </Link>
      </div>
    </header>
  )
}
