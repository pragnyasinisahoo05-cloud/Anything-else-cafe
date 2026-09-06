import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/reveal'

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-pour.png"
          alt="Barista pouring milk into a latte to create rosetta art"
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/55 via-primary/25 to-primary/85" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-28 md:px-8 md:pb-24">
        <div className="max-w-4xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary-foreground/80">
              <span className="h-px w-8 bg-accent" />
              Portland · Est. 2014
            </span>
          </Reveal>

          <h1 className="mt-6 font-serif text-[15vw] leading-[0.85] tracking-tight text-primary-foreground sm:text-7xl md:text-8xl lg:text-[8.5rem]">
            <Reveal variant="blur" as="span" className="block">
              Anything
            </Reveal>
            <Reveal variant="blur" as="span" delay={140} className="block italic text-accent">
              Else?
            </Reveal>
          </h1>

          <Reveal delay={260}>
            <p className="mt-8 max-w-lg text-pretty text-lg leading-relaxed text-primary-foreground/85">
              Small-batch roasting, patient brewing, and a warm corner to call
              your own. The only question left to ask.
            </p>
          </Reveal>

          <Reveal delay={360}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/menu"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground transition-transform duration-300 hover:scale-[1.03]"
              >
                <span className="relative z-10">Explore the menu</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                  &rarr;
                </span>
              </Link>
              <Link
                href="/reservation"
                className="inline-flex items-center gap-3 rounded-full border border-primary-foreground/40 px-7 py-3.5 text-sm font-medium text-primary-foreground backdrop-blur-sm transition-colors duration-300 hover:bg-primary-foreground/10"
              >
                Reserve a table
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-5 pb-8 md:px-8">
        <span className="text-xs uppercase tracking-[0.24em] text-primary-foreground/60">
          Single-origin · Roasted in-house
        </span>
        <span className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-primary-foreground/60">
          Scroll
          <span className="relative flex h-10 w-5 justify-center rounded-full border border-primary-foreground/40">
            <span className="mt-1.5 h-2 w-1 animate-float-slow rounded-full bg-accent" />
          </span>
        </span>
      </div>
    </section>
  )
}
