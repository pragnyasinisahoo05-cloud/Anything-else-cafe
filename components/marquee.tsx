type Props = {
  items: string[]
}

export function Marquee({ items }: Props) {
  const loop = [...items, ...items]
  return (
    <div className="relative flex overflow-hidden border-y border-border bg-secondary py-5">
      <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10">
        {loop.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-serif text-xl italic text-foreground/80 md:text-2xl">
              {item}
            </span>
            <span className="text-accent" aria-hidden="true">
              &#10022;
            </span>
          </span>
        ))}
      </div>
      <div
        className="animate-marquee flex shrink-0 items-center gap-10 pr-10"
        aria-hidden="true"
      >
        {loop.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-serif text-xl italic text-foreground/80 md:text-2xl">
              {item}
            </span>
            <span className="text-accent">&#10022;</span>
          </span>
        ))}
      </div>
    </div>
  )
}
