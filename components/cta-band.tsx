import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/reveal'

export function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-primary py-24 md:py-32">
      <Image
        src="/images/beans.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-primary/70" />
      <div className="relative mx-auto max-w-3xl px-5 text-center md:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-accent">
            <span className="h-px w-6 bg-accent" />
            Save your seat
            <span className="h-px w-6 bg-accent" />
          </span>
        </Reveal>
        <Reveal delay={90}>
          <h2 className="mt-5 text-balance font-serif text-4xl leading-[1.02] tracking-tight text-primary-foreground md:text-6xl">
            A table is waiting. So is the coffee.
          </h2>
        </Reveal>
        <Reveal delay={180}>
          <p className="mx-auto mt-6 max-w-lg text-pretty leading-relaxed text-primary-foreground/75">
            Whether it&apos;s a quiet morning solo or a long afternoon with
            friends, reserve a spot and we&apos;ll have everything ready.
          </p>
        </Reveal>
        <Reveal delay={260}>
          <Link
            href="/reservation"
            className="group mt-9 inline-flex items-center gap-3 rounded-full bg-accent px-8 py-4 text-sm font-medium text-accent-foreground transition-transform duration-300 hover:scale-[1.03]"
          >
            Reserve a table
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
