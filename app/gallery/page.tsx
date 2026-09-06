import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { GalleryGrid } from '@/components/gallery/gallery-grid'
import { CtaBand } from '@/components/cta-band'

export const metadata: Metadata = {
  title: 'Gallery — Anything Else',
  description:
    'A look inside Anything Else — the room, the craft, and the mornings that make it worth it.',
}

export default function GalleryPage() {
  return (
    <main>
      <PageHero
        eyebrow="Gallery"
        title="Moments in the room"
        description="Steam, sunlight, and the small rituals of a good morning. Tap any frame to look closer."
        image="/images/gallery-3.png"
        imageAlt="Cozy window table with a book and coffee"
      />

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <GalleryGrid />
      </section>

      <CtaBand />
    </main>
  )
}
