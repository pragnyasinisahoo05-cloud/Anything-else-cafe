import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'

const quotes = [
  {
    quote:
      'The flat white here ruined every other coffee for me. I now measure my mornings by whether I made it to Anything Else.',
    name: 'Mara V.',
    role: 'Regular since 2016',
  },
  {
    quote:
      'You can taste the care. The room is beautiful, the staff remember your order, and somehow there is always a seat by the window.',
    name: 'Daniel O.',
    role: 'Neighbourhood local',
  },
  {
    quote:
      'I came for a meeting and stayed three hours. Best decision of the week. That cold brew is dangerous.',
    name: 'Priya K.',
    role: 'Works remotely here',
  },
]

export function Testimonials() {
  return (
    <section className="bg-secondary py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          align="center"
          eyebrow="Kind words"
          title="Loved by the neighbourhood"
        />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {quotes.map((q, i) => (
            <Reveal key={q.name} delay={i * 120}>
              <figure className="flex h-full flex-col rounded-2xl bg-card p-8">
                <span className="font-serif text-5xl leading-none text-accent" aria-hidden>
                  &ldquo;
                </span>
                <blockquote className="mt-4 flex-1 text-pretty text-lg leading-relaxed text-foreground/90">
                  {q.quote}
                </blockquote>
                <figcaption className="mt-8 border-t border-border pt-5">
                  <p className="font-medium text-foreground">{q.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{q.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
