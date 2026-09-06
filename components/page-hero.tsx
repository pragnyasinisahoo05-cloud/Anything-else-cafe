import Image from 'next/image'
import { Reveal } from '@/components/reveal'

type Props = {
  eyebrow: string
  title: string
  description?: string
  image: string
  imageAlt: string
}

export function PageHero({ eyebrow, title, description, image, imageAlt }: Props) {
  return (
    <section className="relative flex min-h-[62vh] items-end overflow-hidden pb-14 pt-32 md:min-h-[70vh] md:pb-20">
      <div className="absolute inset-0">
        <Image
          src={image || '/placeholder.svg'}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/45 to-primary/25" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-accent">
            <span className="h-px w-6 bg-accent" />
            {eyebrow}
          </span>
        </Reveal>
        <Reveal delay={90}>
          <h1 className="mt-4 max-w-3xl text-balance font-serif text-5xl leading-[0.98] tracking-tight text-primary-foreground md:text-7xl">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={180}>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-primary-foreground/80">
              {description}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
