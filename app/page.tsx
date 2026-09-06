import { Hero } from '@/components/home/hero'
import { Marquee } from '@/components/marquee'
import { Philosophy } from '@/components/home/philosophy'
import { Signatures } from '@/components/home/signatures'
import { AboutTeaser } from '@/components/home/about-teaser'
import { GalleryPreview } from '@/components/home/gallery-preview'
import { Testimonials } from '@/components/home/testimonials'
import { CtaBand } from '@/components/cta-band'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Marquee
        items={[
          'Single-origin espresso',
          'House-roasted weekly',
          'Slow bar pour-overs',
          'Fresh pastries daily',
          'Oat · almond · whole',
        ]}
      />
      <Philosophy />
      <Signatures />
      <AboutTeaser />
      <GalleryPreview />
      <Testimonials />
      <CtaBand />
    </main>
  )
}

