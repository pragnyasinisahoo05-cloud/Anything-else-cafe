'use client'

import { cn } from '@/lib/utils'
import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  /** animation variant */
  variant?: 'up' | 'blur' | 'image'
  /** delay in ms before revealing once in view */
  delay?: number
  /** render as a different element */
  as?: ElementType
  /** only trigger once (default true) */
  once?: boolean
}

export function Reveal({
  children,
  className,
  variant = 'up',
  delay = 0,
  as,
  once = true,
}: RevealProps) {
  const Tag = (as ?? 'div') as ElementType
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [once])

  const base =
    variant === 'blur' ? 'reveal-blur' : variant === 'image' ? 'img-reveal' : 'reveal'

  return (
    <Tag
      ref={ref}
      className={cn(base, visible && 'is-visible', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
