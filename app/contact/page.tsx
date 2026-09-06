import type { Metadata } from 'next'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { ContactForm } from '@/components/forms/contact-form'
import { Reveal } from '@/components/reveal'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact — Anything Else',
  description:
    'Find us, call us, or drop a note. We’re on Kingswood Lane in Portland and we’d love to hear from you.',
}

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Say hello"
        title="Come find us"
        description="Questions, private events, wholesale beans, or just a hello — this way in."
        image="/images/gallery-1.png"
        imageAlt="Friends toasting coffee cups over a table"
      />

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* Details */}
          <div>
            <Reveal>
              <h2 className="font-serif text-3xl text-foreground md:text-4xl">
                The details
              </h2>
            </Reveal>
            <div className="mt-8 space-y-6">
              {[
                { icon: MapPin, label: 'Visit', value: site.address },
                { icon: Phone, label: 'Call', value: site.phone, href: `tel:${site.phone}` },
                { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
              ].map((row, i) => (
                <Reveal key={row.label} delay={i * 90}>
                  <div className="flex items-start gap-4 border-b border-border pb-6">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-accent">
                      <row.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        {row.label}
                      </p>
                      {row.href ? (
                        <a
                          href={row.href}
                          className="link-underline mt-1 inline-block font-serif text-xl text-foreground"
                        >
                          {row.value}
                        </a>
                      ) : (
                        <p className="mt-1 font-serif text-xl text-foreground">{row.value}</p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}

              <Reveal delay={270}>
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-accent">
                    <Clock className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Hours
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {site.hours.map((h) => (
                        <li
                          key={h.day}
                          className="flex justify-between gap-8 text-foreground/90"
                        >
                          <span>{h.day}</span>
                          <span className="text-muted-foreground">{h.time}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Form */}
          <Reveal variant="blur" delay={120}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </main>
  )
}
