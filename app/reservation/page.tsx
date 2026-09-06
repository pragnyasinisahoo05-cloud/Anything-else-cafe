import type { Metadata } from 'next'
import Image from 'next/image'
import { PageHero } from '@/components/page-hero'
import { ReservationForm } from '@/components/forms/reservation-form'
import { Reveal } from '@/components/reveal'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Reserve a Table — Anything Else',
  description:
    'Reserve a table at Anything Else. Tell us when you’re coming and we’ll have your corner ready.',
}

const perks = [
  'Priority seating by the window',
  'Groups of up to 8 welcome',
  'Complimentary still & sparkling water',
  'Tables held 15 minutes past booking',
]

export default function ReservationPage() {
  return (
    <main>
      <PageHero
        eyebrow="Reservations"
        title="Save your corner"
        description="Mornings fill fast. Tell us when you’re coming and we’ll have the good seat and the good coffee ready."
        image="/images/interior.png"
        imageAlt="Warm café interior with cozy seating"
      />

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Aside */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal variant="image" className="overflow-hidden rounded-2xl">
              <Image
                src="/images/gallery-3.png"
                alt="Cozy window table waiting with a coffee"
                width={640}
                height={520}
                className="h-full w-full object-cover"
              />
            </Reveal>
            <Reveal delay={120}>
              <ul className="mt-8 space-y-4">
                {perks.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-foreground/90">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs text-accent-foreground">
                      &#10003;
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
                Planning something bigger? For private events and buy-outs, email{' '}
                <a
                  href={`mailto:${site.email}`}
                  className="link-underline text-foreground"
                >
                  {site.email}
                </a>
                .
              </p>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal variant="blur" delay={100}>
            <ReservationForm />
          </Reveal>
        </div>
      </section>
    </main>
  )
}
