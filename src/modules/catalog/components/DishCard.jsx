import { motion } from 'framer-motion'
import { SmartImage, Badge } from '@/core/ui'
import { img } from '@/core/lib/image'
import { formatMoney } from '@/core/lib/format'
import { cn } from '@/core/lib/cn'
import { VegMark, SpiceLevel, Rating } from './DishBits'

/**
 * Presentational dish card. Purchasing behaviour is injected through `action`
 * so the catalog module stays independent of the ordering module.
 */
export function DishCard({ dish, action, variant = 'grid', className }) {
  if (variant === 'row') {
    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className={cn('group flex gap-4 rounded-2xl border border-line bg-surface/70 p-3 transition-colors hover:border-gold-400/40', !dish.available && 'opacity-50', className)}
      >
        <SmartImage src={img(dish.image, { w: 300, h: 300 })} alt={dish.name} className="size-24 shrink-0 rounded-xl sm:size-28" imgClassName="transition-transform duration-700 group-hover:scale-110" />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2">
            <VegMark veg={dish.veg} />
            <h4 className="truncate font-semibold">{dish.name}</h4>
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{dish.description}</p>
          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-semibold text-gold-300">{formatMoney(dish.price)}</span>
              <SpiceLevel level={dish.spice} />
            </div>
            {dish.available ? action : <Badge>Sold out</Badge>}
          </div>
        </div>
      </motion.article>
    )
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn('group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface/70 transition-all duration-500 hover:-translate-y-1 hover:border-gold-400/40 hover:shadow-2xl hover:shadow-black/40', !dish.available && 'opacity-50', className)}
    >
      <div className="relative">
        <SmartImage src={img(dish.image, { w: 640, h: 480 })} alt={dish.name} className="aspect-[4/3]" imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-silk)] group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {dish.tags?.slice(0, 2).map((t) => (
            <span key={t} className="rounded-full bg-ink-950/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-200 backdrop-blur">
              {t}
            </span>
          ))}
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-ink-950/60 px-2.5 py-1 text-pearl-100 backdrop-blur">
          <Rating value={dish.rating} />
          <span className="text-[10px] text-pearl-300">· {dish.prepTime} min</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-tight">{dish.name}</h3>
          <VegMark veg={dish.veg} className="mt-1" />
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{dish.description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div>
            <div className="font-display text-2xl font-semibold text-gold-300">{formatMoney(dish.price)}</div>
            <SpiceLevel level={dish.spice} className="mt-0.5" />
          </div>
          {dish.available ? action : <Badge tone="red">Sold out</Badge>}
        </div>
      </div>
    </motion.article>
  )
}
