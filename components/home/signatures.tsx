import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'

const signatures = [
  {
    name: 'Caramel Latte',
    note: 'Salted caramel · double ristretto',
    price: '5.50',
    image: '/images/drink-latte.png',
  },
  {
    name: 'Cold Brew',
    note: '18-hour steep · cream swirl',
    price: '5.00',
    image: '/images/drink-coldbrew.png',
  },
  {
    name: 'Butter Croissant',
    note: 'Three-day laminated · flaky',
    price: '4.00',
    image: '/images/drink-pastry.png',
  },
]

export function Signatures() {
  return (
    <section className="bg-secondary py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Crowd favourites"
            title="The ones they come back for"
          />
          <Reveal>
            <Link
              href="/menu"
              className="link-underline inline-flex items-center gap-2 text-sm font-medium text-foreground"
            >
              View full menu &rarr;
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {signatures.map((item, i) => (
            <Reveal key={item.name} delay={i * 120}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-card">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="absolute right-4 top-4 rounded-full bg-background/90 px-3 py-1 font-serif text-sm text-foreground backdrop-blur">
                    ${item.price}
                  </span>
                </div>
                <div className="flex items-center justify-between p-6">
                  <div>
                    <h3 className="font-serif text-2xl text-foreground">{item.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 translate-y-1 items-center justify-center rounded-full border border-border text-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    &rarr;
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
