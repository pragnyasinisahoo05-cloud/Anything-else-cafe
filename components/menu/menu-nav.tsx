'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { MenuCategory } from '@/lib/site'

export function MenuNav({ categories }: { categories: MenuCategory[] }) {
  const [active, setActive] = useState(categories[0]?.id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    categories.forEach((c) => {
      const el = document.getElementById(c.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [categories])

  return (
    <div className="sticky top-16 z-30 -mx-5 border-y border-border bg-background/85 px-5 backdrop-blur-md md:top-20 md:mx-0 md:rounded-full md:border">
      <ul className="mx-auto flex max-w-2xl items-center gap-1 overflow-x-auto py-2 md:justify-center">
        {categories.map((c) => (
          <li key={c.id} className="shrink-0">
            <a
              href={`#${c.id}`}
              className={cn(
                'inline-flex rounded-full px-4 py-2 text-sm transition-colors duration-300',
                active === c.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {c.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
