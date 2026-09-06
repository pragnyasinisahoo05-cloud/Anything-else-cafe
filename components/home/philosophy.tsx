import Image from 'next/image'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'

const stats = [
  { value: '12', label: 'Single origins on rotation' },
  { value: '48h', label: 'From roast to your cup' },
  { value: '2014', label: 'Pouring since' },
]

export function Philosophy() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
          <Reveal variant="image" className="overflow-hidden rounded-2xl">
            <Image
              src="/images/beans.png"
              alt="Freshly roasted coffee beans spilling from a burlap sack"
              width={720}
              height={860}
              className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-105"
            />
          </Reveal>
          <Reveal
            delay={200}
            className="absolute -bottom-8 -right-4 hidden w-44 rounded-xl bg-accent p-5 text-accent-foreground shadow-xl sm:block md:-right-8"
          >
            <p className="font-serif text-3xl leading-none">100%</p>
            <p className="mt-2 text-xs uppercase tracking-widest">
              Ethically sourced beans
            </p>
          </Reveal>
        </div>

        <div>
          <SectionHeading
            eyebrow="Our philosophy"
            title={
              <>
                Coffee worth <span className="italic text-accent">slowing down</span> for.
              </>
            }
            description="We roast in small batches, cup every lot, and pour with the kind of patience that only comes from loving the craft. No shortcuts, no rush — just the good stuff, made properly."
          />

          <Reveal delay={220}>
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="font-serif text-4xl text-foreground md:text-5xl">
                    {s.value}
                  </dt>
                  <dd className="mt-2 text-sm leading-snug text-muted-foreground">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
