import { cn } from '@/lib/utils'

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <span
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300',
          light ? 'border-primary-foreground/30 text-accent' : 'border-foreground/25 text-accent',
        )}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M4 8h11a4 4 0 0 1 0 8h-1M4 8v6a4 4 0 0 0 4 4h3a4 4 0 0 0 4-4V8H4Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 2.5c-.6.8-.6 1.6 0 2.4M11.5 2.5c-.6.8-.6 1.6 0 2.4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-serif text-lg tracking-tight transition-colors duration-300',
            light ? 'text-primary-foreground' : 'text-foreground',
          )}
        >
          Anything Else
        </span>
        <span
          className={cn(
            'text-[10px] uppercase tracking-[0.28em] transition-colors duration-300',
            light ? 'text-primary-foreground/60' : 'text-foreground/55',
          )}
        >
          Coffee Roasters
        </span>
      </span>
    </span>
  )
}
