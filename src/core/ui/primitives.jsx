import { forwardRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Minus, Plus, ImageOff } from 'lucide-react'
import { cn } from '@/core/lib/cn'
import { initials } from '@/core/lib/format'

/* ───────── Card ───────── */
export function Card({ className, children, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-line bg-surface',
        hover && 'transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-xl hover:shadow-black/5',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action, className, icon: Icon }) {
  return (
    <div className={cn('flex items-start justify-between gap-3 px-5 pt-5', className)}>
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gold-400/10 text-gold-500 dark:text-gold-300">
            <Icon className="size-4.5" />
          </span>
        )}
        <div className="min-w-0">
          <h3 className="truncate font-semibold tracking-tight">{title}</h3>
          {subtitle && <p className="mt-0.5 truncate text-xs text-muted">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

/* ───────── Badge ───────── */
const tones = {
  neutral: 'bg-surface-2 text-muted border-line',
  gold: 'bg-gold-400/12 text-gold-600 dark:text-gold-300 border-gold-400/25',
  red: 'bg-lacquer-500/10 text-lacquer-600 dark:text-lacquer-300 border-lacquer-500/25',
  jade: 'bg-jade-500/10 text-jade-600 dark:text-jade-300 border-jade-500/25',
  blue: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/25',
  violet: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/25',
  amber: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25',
}

export function Badge({ tone = 'neutral', dot, className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide',
        tones[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

/* ───────── Form controls ───────── */
const fieldBase =
  'w-full rounded-xl border border-line bg-surface-2/60 px-3.5 text-sm text-fg placeholder:text-muted/70 outline-none transition focus:border-gold-400/70 focus:bg-surface focus:ring-4 focus:ring-gold-400/10 disabled:opacity-50'

export const Input = forwardRef(function Input({ className, icon: Icon, ...props }, ref) {
  if (Icon) {
    return (
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <input ref={ref} className={cn(fieldBase, 'h-11 pl-10', className)} {...props} />
      </div>
    )
  }
  return <input ref={ref} className={cn(fieldBase, 'h-11', className)} {...props} />
})

export const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn(fieldBase, 'min-h-24 py-3', className)} {...props} />
})

export const Select = forwardRef(function Select({ className, children, ...props }, ref) {
  return (
    <select ref={ref} className={cn(fieldBase, 'h-11 appearance-none bg-[length:16px] bg-[right_0.85rem_center] bg-no-repeat pr-9', className)} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a69a8b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }} {...props}>
      {children}
    </select>
  )
})

export function Field({ label, hint, error, children, className, required }) {
  return (
    <label className={cn('block space-y-1.5', className)}>
      {label && (
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          {label}
          {required && <span className="text-lacquer-400"> *</span>}
        </span>
      )}
      {children}
      {error ? <span className="block text-xs text-lacquer-400">{error}</span> : hint && <span className="block text-xs text-muted">{hint}</span>}
    </label>
  )
}

export function Switch({ checked, onChange, label, size = 'md' }) {
  const dims = size === 'sm' ? 'h-5 w-9' : 'h-6 w-11'
  const knob = size === 'sm' ? 'size-4' : 'size-5'
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn('relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors', dims, checked ? 'bg-jade-500' : 'bg-surface-3')}
    >
      <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 32 }} className={cn('rounded-full bg-white shadow', knob, checked && 'ml-auto')} />
    </button>
  )
}

/* ───────── Segmented control with sliding pill ───────── */
export function Segmented({ options, value, onChange, className, size = 'md', layoutId = 'seg' }) {
  return (
    <div className={cn('inline-flex rounded-2xl border border-line bg-surface-2/70 p-1', className)} role="tablist">
      {options.map((opt) => {
        const o = typeof opt === 'string' ? { value: opt, label: opt } : opt
        const active = o.value === value
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'relative flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl font-semibold transition-colors',
              size === 'sm' ? 'h-8 px-3 text-xs' : 'h-10 px-4 text-sm',
              active ? 'text-ink-950' : 'text-muted hover:text-fg',
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-xl bg-gradient-to-b from-gold-300 to-gold-500 shadow"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {o.icon && <o.icon className="size-4" />}
              {o.label}
              {o.count != null && <span className={cn('rounded-md px-1.5 text-[10px]', active ? 'bg-ink-950/15' : 'bg-surface-3')}>{o.count}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ───────── Quantity stepper ───────── */
export function QuantityStepper({ value, onChange, min = 0, max = 99, size = 'md', className }) {
  const s = size === 'sm' ? 'h-8 text-xs' : 'h-10 text-sm'
  const b = size === 'sm' ? 'w-8' : 'w-10'
  return (
    <div className={cn('inline-flex items-center rounded-xl border border-line bg-surface-2/70', s, className)}>
      <button type="button" aria-label="Decrease" onClick={() => onChange(Math.max(min, value - 1))} className={cn('grid h-full place-items-center text-muted hover:text-fg', b)}>
        <Minus className="size-3.5" />
      </button>
      <motion.span key={value} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="min-w-6 text-center font-bold tabular-nums">
        {value}
      </motion.span>
      <button type="button" aria-label="Increase" onClick={() => onChange(Math.min(max, value + 1))} className={cn('grid h-full place-items-center text-muted hover:text-fg', b)}>
        <Plus className="size-3.5" />
      </button>
    </div>
  )
}

/* ───────── Image with shimmer + graceful fallback ───────── */
export function SmartImage({ src, alt, className, imgClassName, ...props }) {
  const [state, setState] = useState('loading')
  return (
    <div className={cn('relative overflow-hidden bg-surface-2', className)}>
      {state === 'loading' && <div className="skeleton absolute inset-0" />}
      {state === 'error' ? (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-lacquer-700/40 to-ink-800 text-gold-300/60">
          <span className="font-cjk text-4xl">龍</span>
          <ImageOff className="absolute bottom-2 right-2 size-4 opacity-50" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
          className={cn('size-full object-cover transition-opacity duration-700', state === 'loaded' ? 'opacity-100' : 'opacity-0', imgClassName)}
          {...props}
        />
      )}
    </div>
  )
}

/* ───────── Avatar ───────── */
const avatarColors = ['from-lacquer-400 to-lacquer-600', 'from-gold-300 to-gold-500', 'from-jade-400 to-jade-600', 'from-violet-400 to-violet-600', 'from-sky-400 to-sky-600']
export function Avatar({ name, size = 'md', className }) {
  const idx = [...(name || '')].reduce((a, c) => a + c.charCodeAt(0), 0) % avatarColors.length
  const dims = { sm: 'size-7 text-[10px]', md: 'size-9 text-xs', lg: 'size-12 text-sm' }[size]
  return (
    <span className={cn('inline-grid shrink-0 place-items-center rounded-full bg-gradient-to-br font-bold text-white', avatarColors[idx], dims, className)}>
      {initials(name)}
    </span>
  )
}

/* ───────── Misc ───────── */
export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
      {Icon && (
        <div className="mb-4 grid size-14 place-items-center rounded-2xl border border-line bg-surface-2 text-gold-400">
          <Icon className="size-6" />
        </div>
      )}
      <h4 className="font-display text-xl">{title}</h4>
      {description && <p className="mt-1.5 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ProgressBar({ value, max = 100, tone = 'gold', className }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const color = { gold: 'from-gold-300 to-gold-500', red: 'from-lacquer-400 to-lacquer-600', jade: 'from-jade-300 to-jade-500', amber: 'from-amber-300 to-amber-500' }[tone]
  return (
    <div className={cn('h-2 overflow-hidden rounded-full bg-surface-3', className)}>
      <motion.div
        className={cn('h-full rounded-full bg-gradient-to-r', color)}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}

export function Divider({ className, label }) {
  if (!label) return <hr className={cn('border-line', className)} />
  return (
    <div className={cn('flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted', className)}>
      <span className="h-px flex-1 bg-line" />
      {label}
      <span className="h-px flex-1 bg-line" />
    </div>
  )
}

export function Kbd({ children }) {
  return <kbd className="rounded-md border border-line bg-surface-2 px-1.5 py-0.5 font-sans text-[10px] font-semibold text-muted">{children}</kbd>
}
