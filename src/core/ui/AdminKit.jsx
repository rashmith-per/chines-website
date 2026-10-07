import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/core/lib/cn'
import { CountUp } from '@/core/animation/effects'

/** Standard header for every back-office page. */
export function PageHeader({ title, subtitle, actions, cjk, children }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-3">
          {cjk && <span className="font-cjk text-3xl text-gold-500/80 dark:text-gold-300/80">{cjk}</span>}
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
        </div>
        {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
        {children}
      </motion.div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

const accentMap = {
  gold: 'text-gold-600 dark:text-gold-300 bg-gold-400/12',
  red: 'text-lacquer-600 dark:text-lacquer-300 bg-lacquer-500/10',
  jade: 'text-jade-600 dark:text-jade-300 bg-jade-500/10',
  violet: 'text-violet-600 dark:text-violet-300 bg-violet-500/10',
  sky: 'text-sky-600 dark:text-sky-300 bg-sky-500/10',
  amber: 'text-amber-600 dark:text-amber-300 bg-amber-500/10',
}

/** KPI tile with animated counter and trend chip. */
export function StatCard({ label, value, icon: Icon, accent = 'gold', trend, hint, format, prefix, suffix, index = 0, className }) {
  const up = trend >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn('group relative overflow-hidden rounded-2xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-xl hover:shadow-black/5', className)}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-gold-400/5 blur-2xl transition-opacity group-hover:opacity-100" />
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</span>
        {Icon && (
          <span className={cn('grid size-9 place-items-center rounded-xl', accentMap[accent])}>
            <Icon className="size-4.5" />
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-3xl font-semibold tracking-tight tabular-nums">
        {typeof value === 'number' ? <CountUp to={value} duration={1.4} prefix={prefix} suffix={suffix} format={format} /> : value}
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {trend != null && (
          <span className={cn('inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold', up ? 'bg-jade-500/10 text-jade-600 dark:text-jade-300' : 'bg-lacquer-500/10 text-lacquer-600 dark:text-lacquer-300')}>
            {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(trend)}%
          </span>
        )}
        {hint && <span className="text-muted">{hint}</span>}
      </div>
    </motion.div>
  )
}

export function Toolbar({ children, className }) {
  return <div className={cn('mb-4 flex flex-wrap items-center gap-2', className)}>{children}</div>
}
