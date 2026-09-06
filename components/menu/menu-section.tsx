import type { MenuCategory } from '@/lib/site'

export function MenuSection({ category }: { category: MenuCategory }) {
  return (
    <section id={category.id} className="scroll-mt-28 py-16 md:py-20">
      <div className="mb-10 max-w-2xl">
        <span className="text-xs uppercase tracking-[0.28em] text-accent">
          {category.title}
        </span>

        <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
          {category.title}
        </h2>

        <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          {category.blurb}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {category.items.map((item) => (
          <article
            key={item.name}
            className="group overflow-hidden rounded-2xl border border-border bg-card"
          >
            {/* Item image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No image
                </div>
              )}
            </div>

            {/* Item information */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
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

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                <span className="shrink-0 font-serif text-lg text-foreground">
                  ₹{item.price}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}