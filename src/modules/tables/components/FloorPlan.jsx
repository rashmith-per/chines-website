import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { cn } from '@/core/lib/cn'
import { elapsed } from '@/core/lib/format'
import { useNow } from '@/core/hooks'
import { ZONES, TABLE_STATUS } from '../store/tables.store'

/** Interactive restaurant floor — tables grouped by zone, colour-coded by status. */
export function FloorPlan({ tables, selectedId, onSelect, compact = false }) {
  const now = useNow(15000)
  return (
    <div className="space-y-6">
      {ZONES.map((zone) => {
        const zoneTables = tables.filter((t) => t.zone === zone)
        if (!zoneTables.length) return null
        return (
          <div key={zone}>
            <div className="mb-3 flex items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted">{zone}</span>
              <span className="h-px flex-1 bg-gradient-to-r from-line-strong to-transparent" />
              {zone === 'Window' && <span className="rounded-md border border-sky-400/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-sky-500 dark:text-sky-300">◫ Window side</span>}
            </div>
            <div className={cn('grid gap-3', compact ? 'grid-cols-3 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4')}>
              {zoneTables.map((t, i) => {
                const meta = TABLE_STATUS[t.status]
                const selected = selectedId === t.id
                return (
                  <motion.button
                    key={t.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelect?.(t)}
                    className={cn(
                      'relative flex flex-col items-start rounded-2xl border-2 p-3.5 text-left transition-shadow',
                      meta.fill,
                      selected && 'ring-4 ring-gold-400/40 shadow-xl',
                      compact ? 'min-h-20' : 'min-h-28',
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="font-display text-2xl font-semibold">{t.id}</span>
                      <span className="flex items-center gap-1 text-xs font-semibold opacity-80">
                        <Users className="size-3.5" /> {t.capacity}
                      </span>
                    </div>
                    {!compact && (
                      <div className="mt-auto w-full pt-2 text-xs">
                        <div className="font-semibold">{meta.label}</div>
                        <div className="truncate opacity-75">
                          {t.status === 'occupied' && t.seatedAt ? `${t.guest} · ${elapsed(t.seatedAt, now).split(':')[0]} min` : t.guest ?? '—'}
                        </div>
                      </div>
                    )}
                    {t.status === 'occupied' && <span className="absolute right-2 top-2 hidden size-2 animate-pulse rounded-full bg-lacquer-500" />}
                  </motion.button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function FloorLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs">
      {Object.entries(TABLE_STATUS).map(([k, v]) => (
        <span key={k} className="flex items-center gap-1.5">
          <span className={cn('size-3 rounded border-2', v.fill)} /> {v.label}
        </span>
      ))}
    </div>
  )
}
