import { motion } from 'framer-motion'
import { Check, ChefHat, ClipboardCheck, PackageCheck, Receipt, Utensils, ShoppingBag, Bike, BedDouble } from 'lucide-react'
import { Badge } from '@/core/ui'
import { cn } from '@/core/lib/cn'
import { formatMoney, formatTime } from '@/core/lib/format'
import { ORDER_TYPE_META } from '@/core/config/app.config'
import { ORDER_FLOW, STATUS_META } from '../store/orders.store'

export const TYPE_ICONS = { 'dine-in': Utensils, takeaway: ShoppingBag, delivery: Bike, 'room-service': BedDouble }
const TYPE_TONES = { 'dine-in': 'gold', takeaway: 'jade', delivery: 'red', 'room-service': 'violet' }

export function OrderTypeBadge({ type }) {
  const Icon = TYPE_ICONS[type]
  return (
    <Badge tone={TYPE_TONES[type]}>
      {Icon && <Icon className="size-3" />}
      {ORDER_TYPE_META[type]?.label}
    </Badge>
  )
}

export function OrderStatusBadge({ status }) {
  const meta = STATUS_META[status]
  return (
    <Badge tone={meta?.tone} dot>
      {meta?.label}
    </Badge>
  )
}

const STEP_ICONS = { received: Receipt, confirmed: ClipboardCheck, preparing: ChefHat, ready: PackageCheck, completed: Check }

/** Animated vertical / horizontal status tracker. */
export function OrderStatusStepper({ order, orientation = 'horizontal' }) {
  const current = ORDER_FLOW.indexOf(order.status)
  const vertical = orientation === 'vertical'
  return (
    <ol className={cn('relative flex', vertical ? 'flex-col gap-6' : 'items-start justify-between gap-2')}>
      {!vertical && (
        <div className="absolute left-[10%] right-[10%] top-6 h-0.5 rounded bg-line-strong">
          <motion.div
            className="h-full rounded bg-gradient-to-r from-gold-400 to-jade-400"
            initial={{ width: 0 }}
            animate={{ width: `${(Math.max(0, current) / (ORDER_FLOW.length - 1)) * 100}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      )}
      {ORDER_FLOW.map((step, i) => {
        const Icon = STEP_ICONS[step]
        const done = i < current || order.status === 'completed'
        const active = i === current && order.status !== 'completed'
        const at = order.timeline.find((t) => t.status === step)?.at
        return (
          <li key={step} className={cn('relative z-10 flex', vertical ? 'items-center gap-4' : 'flex-1 flex-col items-center text-center')}>
            <motion.div
              animate={{ scale: active ? 1.08 : 1 }}
              className={cn(
                'relative grid size-12 place-items-center rounded-2xl border transition-colors duration-500',
                done && 'border-jade-400/50 bg-jade-500 text-white',
                active && 'border-gold-300 bg-gradient-to-b from-gold-300 to-gold-500 text-ink-950 shadow-lg shadow-gold-500/30',
                !done && !active && 'border-line-strong bg-surface-2 text-muted',
              )}
            >
              {active && <span className="absolute inset-0 animate-ping rounded-2xl bg-gold-400/30" />}
              <Icon className="relative size-5" />
            </motion.div>
            <div className={cn(vertical ? '' : 'mt-3')}>
              <div className={cn('text-sm font-semibold', !done && !active && 'text-muted')}>{STATUS_META[step].label}</div>
              <div className="text-xs text-muted">{at ? formatTime(at) : active ? 'In progress' : '—'}</div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/** Totals block used by cart, checkout, POS and receipts. */
export function TotalsBlock({ totals, className, emphasize = true }) {
  const row = (label, value, cls) => (
    <div className={cn('flex items-center justify-between text-sm', cls)}>
      <span className="text-muted">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  )
  return (
    <div className={cn('space-y-2', className)}>
      {row('Subtotal', formatMoney(totals.subtotal))}
      {totals.discount > 0 && row('Discount', `− ${formatMoney(totals.discount)}`, '[&>span:last-child]:text-jade-400')}
      {row('GST / Taxes (18%)', formatMoney(totals.tax))}
      {totals.deliveryFee > 0 && row('Delivery', formatMoney(totals.deliveryFee))}
      <div className={cn('flex items-center justify-between border-t border-dashed border-line-strong pt-3', emphasize && 'mt-1')}>
        <span className="font-semibold">Total</span>
        <span className="font-display text-2xl font-semibold text-gold-300 tabular-nums">{formatMoney(totals.total)}</span>
      </div>
    </div>
  )
}
