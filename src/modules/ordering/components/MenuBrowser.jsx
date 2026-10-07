import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Leaf, LayoutGrid, Rows3 } from 'lucide-react'
import { Input, EmptyState } from '@/core/ui'
import { cn } from '@/core/lib/cn'
import { useCatalogStore, CATEGORIES, DishCard } from '@/modules/catalog'
import { AddToCart } from './AddToCart'

/**
 * Searchable, filterable menu with category rail. Shared by the Menu page,
 * Order Online and Room Service flows.
 */
export function MenuBrowser({ defaultLayout = 'grid', stickyTop = 'top-20', compact = false, initialCategory = 'all' }) {
  const items = useCatalogStore((s) => s.items)
  const [category, setCategory] = useState(initialCategory)
  const [query, setQuery] = useState('')
  const [vegOnly, setVegOnly] = useState(false)
  const [layout, setLayout] = useState(defaultLayout)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter(
      (i) =>
        (category === 'all' || i.category === category) &&
        (!vegOnly || i.veg) &&
        (!q || i.name.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q)),
    )
  }, [items, category, query, vegOnly])

  const cats = [{ id: 'all', name: 'All', cjk: '全' }, ...CATEGORIES]

  return (
    <div>
      <div className={cn('sticky z-30 -mx-4 mb-6 border-b border-line bg-bg/85 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:border', stickyTop)}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="scrollbar-none -mx-1 flex flex-1 gap-1.5 overflow-x-auto px-1" data-lenis-prevent-wheel>
            {cats.map((c) => {
              const active = c.id === category
              return (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={cn('relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors', active ? 'text-ink-950' : 'text-muted hover:text-fg')}
                >
                  {active && <motion.span layoutId="menu-cat" className="absolute inset-0 rounded-full bg-gradient-to-b from-gold-300 to-gold-500" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <span className="relative font-cjk text-xs opacity-70">{c.cjk}</span>
                  <span className="relative">{c.name}</span>
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 lg:w-64">
              <Input icon={Search} placeholder="Search dishes…" value={query} onChange={(e) => setQuery(e.target.value)} className="h-10" />
            </div>
            <button onClick={() => setVegOnly((v) => !v)} className={cn('flex h-10 items-center gap-1.5 rounded-xl border px-3 text-sm font-semibold transition', vegOnly ? 'border-jade-500 bg-jade-500/15 text-jade-300' : 'border-line text-muted hover:text-fg')}>
              <Leaf className="size-4" /> Veg
            </button>
            {!compact && (
              <div className="hidden rounded-xl border border-line p-0.5 sm:flex">
                {[['grid', LayoutGrid], ['row', Rows3]].map(([key, Icon]) => (
                  <button key={key} onClick={() => setLayout(key)} className={cn('grid size-9 place-items-center rounded-lg', layout === key ? 'bg-surface-3 text-gold-300' : 'text-muted')} aria-label={`${key} layout`}>
                    <Icon className="size-4" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Search} title="No dishes found" description="Try a different search or category." />
      ) : (
        <motion.div layout className={cn('grid gap-5', layout === 'grid' ? (compact ? 'sm:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4') : 'lg:grid-cols-2')}>
          <AnimatePresence mode="popLayout">
            {filtered.map((dish) => (
              <DishCard key={dish.id} dish={dish} variant={layout} action={<AddToCart dish={dish} size={layout === 'row' ? 'sm' : 'md'} />} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
