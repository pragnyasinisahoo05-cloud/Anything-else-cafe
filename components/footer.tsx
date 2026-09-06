import Link from 'next/link'
import { navLinks, site } from '@/lib/site'
import { Logo } from '@/components/logo'
import { Reveal } from '@/components/reveal'

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* Oversized wordmark */}
      <div className="pointer-events-none select-none overflow-hidden">
        <p className="whitespace-nowrap px-4 pt-14 text-center font-serif text-[18vw] leading-[0.8] tracking-tight text-primary-foreground/[0.06] md:text-[15vw]">
          Anything Else
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-12 md:px-8">
        <Reveal className="grid gap-12 border-t border-primary-foreground/15 pt-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo className="[&_span]:text-primary-foreground [&_.text-accent]:text-accent" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
              A neighbourhood roastery pouring carefully sourced coffee and warm
              conversation since 2014.
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.24em] text-primary-foreground/50">
              Explore
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {[...navLinks, { label: 'Reservation', href: '/reservation' }].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="link-underline text-primary-foreground/80 hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.24em] text-primary-foreground/50">
              Visit
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-primary-foreground/80">
              <li>{site.address}</li>
              <li>
                <a href={`tel:${site.phone}`} className="link-underline hover:text-accent">
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="link-underline hover:text-accent">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.24em] text-primary-foreground/50">
              Hours
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-primary-foreground/80">
              {site.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-4">
                  <span>{h.day}</span>
                  <span className="text-primary-foreground/60">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/50 md:flex-row">
          <p>© {new Date().getFullYear()} Anything Else Coffee Roasters. All rights reserved.</p>
          <div className="flex gap-6">
            {site.social.map((s) => (
              <a key={s.label} href={s.href} className="link-underline hover:text-accent">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
