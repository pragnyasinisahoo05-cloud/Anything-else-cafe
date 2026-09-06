import { cn } from '@/lib/utils'
import { Reveal } from '@/components/reveal'

type Props = {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: Props) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <span
            className={cn(
              'inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-accent',
              align === 'center' && 'justify-center',
            )}
          >
            <span className="h-px w-6 bg-accent" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={80}>
        <h2 className="mt-4 text-balance font-serif text-4xl leading-[1.05] tracking-tight text-foreground md:text-5xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={160}>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}
