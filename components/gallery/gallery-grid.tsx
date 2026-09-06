'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { gallery } from '@/lib/site'

const spanClass: Record<string, string> = {
  tall: 'row-span-2',
  wide: 'sm:col-span-2',
  normal: '',
}

export function GalleryGrid() {
  const [index, setIndex] = useState<number | null>(null)
  const open = index !== null

  const close = useCallback(() => setIndex(null), [])

  const prev = useCallback(() => {
    setIndex((i) =>
      i === null ? i : (i - 1 + gallery.length) % gallery.length,
    )
  }, [])

  const next = useCallback(() => {
    setIndex((i) =>
      i === null ? i : (i + 1) % gallery.length,
    )
  }, [])

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close, prev, next])

  return (
    <>
      <div className="grid auto-rows-[220px] grid-cols-2 gap-4 sm:auto-rows-[260px] md:grid-cols-4">
        {gallery.map((shot, i) => (
          <div
            key={shot.src}
            className={cn(
              'overflow-hidden rounded-xl',
              spanClass[shot.span],
            )}
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative h-full w-full overflow-hidden"
              aria-label={`Open image: ${shot.alt}`}
            >
              <Image
                src={shot.src || '/placeholder.svg'}
                alt={shot.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
              />

              <span className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/30" />

              <span className="absolute bottom-4 left-4 translate-y-3 text-sm text-primary-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                View
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <div
        className={cn(
          'fixed inset-0 z-[60] flex items-center justify-center bg-primary/95 p-4 backdrop-blur-sm transition-opacity duration-300',
          open
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-primary-foreground/30 text-primary-foreground transition-colors hover:bg-primary-foreground/10"
        >
          <X className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={prev}
          aria-label="Previous image"
          className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full border border-primary-foreground/30 text-primary-foreground transition-colors hover:bg-primary-foreground/10 md:left-8"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Next image"
          className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full border border-primary-foreground/30 text-primary-foreground transition-colors hover:bg-primary-foreground/10 md:right-8"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {open && (
          <figure className="flex max-h-[85vh] w-full max-w-4xl flex-col items-center">
            <div className="relative h-[70vh] w-full overflow-hidden rounded-xl">
              <Image
                key={gallery[index].src}
                src={gallery[index].src || '/placeholder.svg'}
                alt={gallery[index].alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <figcaption className="mt-4 text-sm text-primary-foreground/70">
              {gallery[index].alt} — {index + 1} / {gallery.length}
            </figcaption>
          </figure>
        )}
      </div>
    </>
  )
}