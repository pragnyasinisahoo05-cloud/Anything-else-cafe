import Image from 'next/image'
import { Reveal } from '@/components/reveal'
import type { MenuCategory } from '@/lib/site'

export function MenuSection({ category }: { category: MenuCategory }) {
  const featured = category.items.filter((i) => i.image)
  return (
    <section id={category.id} className="scroll-mt-28 py-16 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Left: heading + featured image */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.28em] text-accent">
              {category.title}
            </span>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
              {category.title}
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-4 max-w-sm text-pretty leading-relaxed text-muted-foreground">
              {category.blurb}
            </p>
          </Reveal>
          {featured[0]?.image && (
            <Reveal variant="image" delay={200} className="mt-8 overflow-hidden rounded-2xl">
              <div className="group relative aspect-[4/3] overflow-hidden">
                <Image
                  src={featured[0].image || '/placeholder.svg'}
                  alt={featured[0].name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                />
              </div>
            </Reveal>
          )}
        </div>

        {/* Right: item list */}
        <ul className="divide-y divide-border">
          {category.items.map((item, i) => (
            <Reveal as="li" key={item.name} delay={i * 80}>
              <div className="group flex items-baseline gap-4 py-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-serif text-xl text-foreground transition-colors duration-300 group-hover:text-accent md:text-2xl">
                      {item.name}
                    </h3>
                    {item.tag && (
                      <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-accent-foreground/80">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <span
                  className="hidden h-px flex-1 translate-y-[-4px] border-b border-dashed border-border sm:block"
                  aria-hidden="true"
                />
                <span className="font-serif text-lg text-foreground">${item.price}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
