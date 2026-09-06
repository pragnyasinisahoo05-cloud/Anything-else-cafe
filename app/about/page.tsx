import type { Metadata } from 'next'
import Image from 'next/image'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'
import { CtaBand } from '@/components/cta-band'

export const metadata: Metadata = {
  title: 'About — Anything Else',
  description:
    'The story behind Anything Else: a neighbourhood roastery built on patience, provenance, and warm rooms.',
}

const values = [
  {
    title: 'Sourced with intent',
    body: 'We buy directly from farmers we know by name, paying prices that make the craft sustainable at both ends of the cup.',
  },
  {
    title: 'Roasted in small batches',
    body: 'Every green lot is cupped, profiled, and roasted here in-house — never more than a week before it reaches you.',
  },
  {
    title: 'Poured without pretension',
    body: 'Great coffee shouldn’t need a translator. Ask us anything; there are no silly questions at this bar.',
  },
]

const timeline = [
  { year: '2014', text: 'A single second-hand machine and a stubborn idea open on Kingswood Lane.' },
  { year: '2017', text: 'We start roasting our own green coffee in the back room.' },
  { year: '2020', text: 'The community keeps us alive through hard times. We never forget it.' },
  { year: '2024', text: 'Ten years in, still the same corner, still asking “anything else?”' },
]

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="Our Story"
        title="A stubborn love of good coffee"
        description="What started as one machine in a small room became the warm corner this neighbourhood leans on. Here’s how it happened."
        image="/images/interior.png"
        imageAlt="Warm café interior with exposed brick and hanging lights"
      />

      {/* Intro split */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading
            eyebrow="Why we do this"
            title={
              <>
                We built the room we always <span className="italic text-accent">wanted to sit in.</span>
              </>
            }
            description="Anything Else began with a simple frustration: too many cafés felt like transactions. We wanted somewhere unhurried — where the coffee is serious but the welcome is easy, and where nobody rushes you out the door."
          />
          <Reveal variant="image" className="overflow-hidden rounded-2xl">
            <Image
              src="/images/barista.png"
              alt="Barista carefully preparing coffee at the espresso machine"
              width={720}
              height={820}
              className="h-full w-full object-cover transition-transform duration-[1.2s] hover:scale-105"
            />
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-secondary py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading align="center" eyebrow="What we stand for" title="Three things we never cut" />
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 120}>
                <div className="flex h-full flex-col rounded-2xl bg-card p-8">
                  <span className="font-serif text-5xl text-accent/40">0{i + 1}</span>
                  <h3 className="mt-6 font-serif text-2xl text-foreground">{v.title}</h3>
                  <p className="mt-3 flex-1 text-pretty leading-relaxed text-muted-foreground">
                    {v.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            className="lg:sticky lg:top-28 lg:self-start"
            eyebrow="The road here"
            title="Ten years, one corner"
          />
          <ol className="relative border-l border-border pl-8">
            {timeline.map((t, i) => (
              <Reveal as="li" key={t.year} delay={i * 90} className="relative pb-12 last:pb-0">
                <span className="absolute -left-[calc(2rem+1px)] top-1.5 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 border-accent bg-background">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                <p className="font-serif text-3xl text-foreground">{t.year}</p>
                <p className="mt-2 max-w-md text-pretty leading-relaxed text-muted-foreground">
                  {t.text}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
    </main>
  )
}
