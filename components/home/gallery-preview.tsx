import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/reveal'

const shots = [
  { src: '/images/gallery-1.png', alt: 'Friends toasting coffee cups' },
  { src: '/images/gallery-3.png', alt: 'Cozy window table with a book and coffee' },
  { src: '/images/gallery-2.png', alt: 'Latte art being finished' },
  { src: '/images/gallery-4.png', alt: 'Coffee beans roasting in a drum' },
]

export function GalleryPreview() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-accent">
              <span className="h-px w-6 bg-accent" />
              In the room
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 text-balance font-serif text-4xl leading-[1.05] tracking-tight text-foreground md:text-5xl">
              A look inside
            </h2>
          </Reveal>
        </div>
        <Reveal>
          <Link
            href="/gallery"
            className="link-underline inline-flex items-center gap-2 text-sm font-medium text-foreground"
          >
            See the full gallery &rarr;
          </Link>
        </Reveal>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
        {shots.map((shot, i) => (
          <Reveal
            key={shot.src}
            variant="image"
            delay={i * 100}
            className={`overflow-hidden rounded-xl ${i % 2 === 1 ? 'md:mt-10' : ''}`}
          >
            <div className="group relative aspect-[3/4] overflow-hidden">
              <Image
                src={shot.src || '/placeholder.svg'}
                alt={shot.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/20" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
