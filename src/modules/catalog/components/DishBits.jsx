import { Flame, Star } from 'lucide-react'
import { cn } from '@/core/lib/cn'

/** Indian FSSAI-style veg / non-veg mark. */
export function VegMark({ veg, className }) {
  return (
    <span
      title={veg ? 'Vegetarian' : 'Non-vegetarian'}
      className={cn('inline-grid size-4 shrink-0 place-items-center rounded-[3px] border-[1.5px]', veg ? 'border-jade-500' : 'border-lacquer-500', className)}
    >
      <span className={cn('size-1.5 rounded-full', veg ? 'bg-jade-500' : 'bg-lacquer-500')} />
    </span>
  )
}

export function SpiceLevel({ level = 0, className }) {
  if (!level) return null
  return (
    <span className={cn('inline-flex items-center', className)} title={`Spice level ${level}/3`}>
      {Array.from({ length: 3 }, (_, i) => (
        <Flame key={i} className={cn('size-3.5', i < level ? 'fill-lacquer-500 text-lacquer-500' : 'text-muted/40')} />
      ))}
    </span>
  )
}

export function Rating({ value, className }) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-semibold', className)}>
      <Star className="size-3.5 fill-gold-400 text-gold-400" />
      {value?.toFixed(1)}
    </span>
  )
}
