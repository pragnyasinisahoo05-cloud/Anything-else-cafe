import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'

export function AboutTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="order-2 lg:order-1">
          <SectionHeading
            eyebrow="The place"
            title={
              <>
                More than a café — a <span className="italic text-accent">second living room.</span>
              </>
            }
            description="Exposed brick, worn timber, and the low hum of a good conversation. We built Anything Else to be the kind of room you never quite want to leave — where regulars become friends and mornings stretch a little longer."
          />
          <Reveal delay={220}>
            <Link
              href="/about"
              className="group mt-9 inline-flex items-center gap-3 rounded-full border border-foreground/20 px-7 py-3.5 text-sm font-medium text-foreground transition-colors duration-300 hover:bg-foreground hover:text-background"
            >
              Read our story
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          </Reveal>
        </div>

        <div className="order-1 grid grid-cols-2 gap-4 lg:order-2">
          <Reveal variant="image" className="mt-10 overflow-hidden rounded-2xl">
            <Image
              src="/images/interior.png"
              alt="Warm café interior with exposed brick and hanging lights"
              width={480}
              height={600}
              className="h-full w-full object-cover transition-transform duration-[1.2s] hover:scale-105"
            />
          </Reveal>
          <Reveal variant="image" delay={160} className="overflow-hidden rounded-2xl">
            <Image
              src="/images/barista.png"
              alt="Barista working at a vintage espresso machine"
              width={480}
              height={600}
              className="h-full w-full object-cover transition-transform duration-[1.2s] hover:scale-105"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
