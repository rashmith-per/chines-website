import { useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Maximize2, Minimize2, Utensils, ShoppingBag, Bike, BedDouble, Timer, Flame, CheckCheck, ChefHat, BellRing } from 'lucide-react'
import { PageHeader, Button, Segmented } from '@/core/ui'
import { cn } from '@/core/lib/cn'
import { elapsed } from '@/core/lib/format'
import { useDocumentTitle, useNow } from '@/core/hooks'
import { STATIONS } from '@/modules/catalog'
import { useOrdersStore, advanceOrder } from '@/modules/ordering'

const COLUMNS = [
  { status: 'received', title: 'New Orders', action: 'Accept', next: 'confirmed', accent: 'from-sky-400 to-sky-600', ring: 'border-sky-400/40' },
  { status: 'confirmed', title: 'Accepted', action: 'Start Preparing', next: 'preparing', accent: 'from-violet-400 to-violet-600', ring: 'border-violet-400/40' },
  { status: 'preparing', title: 'Preparing', action: 'Mark Ready', next: 'ready', accent: 'from-amber-300 to-amber-500', ring: 'border-amber-400/40' },
  { status: 'ready', title: 'Ready to Serve', action: 'Served / Picked up', next: 'completed', accent: 'from-jade-300 to-jade-500', ring: 'border-jade-400/40' },
]
const TYPE_ICON = { 'dine-in': Utensils, takeaway: ShoppingBag, delivery: Bike, 'room-service': BedDouble }

export default function KdsPage() {
  useDocumentTitle('Kitchen Display')
  const orders = useOrdersStore((s) => s.orders)
  const [station, setStation] = useState('All')
  const [full, setFull] = useState(false)
  const now = useNow(1000)

  const active = useMemo(
    () =>
      orders
        .filter((o) => ['received', 'confirmed', 'preparing', 'ready'].includes(o.status))
        .filter((o) => station === 'All' || o.items.some((i) => i.station === station))
        .sort((a, b) => a.createdAt - b.createdAt),
    [orders, station],
  )
  const late = active.filter((o) => now - o.createdAt > 20 * 60_000 && o.status !== 'ready').length

  const toggleFull = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {})
    else document.exitFullscreen?.()
    setFull((f) => !f)
  }

  return (
    <div className={cn(full && 'fixed inset-0 z-[60] overflow-auto bg-bg p-5')}>
      <PageHeader
        title="Kitchen Display"
        cjk="廚房"
        subtitle="Orders appear automatically after confirmation — bump tickets as they move through the line."
        actions={
          <>
            <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm">
              <Timer className="size-4 text-gold-500" />
              <span className="font-display text-lg font-semibold tabular-nums">{new Date(now).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
            {late > 0 && (
              <span className="flex items-center gap-1.5 rounded-xl bg-lacquer-500/15 px-3 py-2 text-sm font-semibold text-lacquer-500 dark:text-lacquer-300">
                <BellRing className="size-4 animate-sway" /> {late} running late
              </span>
            )}
            <Button variant="subtle" icon={full ? Minimize2 : Maximize2} onClick={toggleFull}>{full ? 'Exit' : 'Fullscreen'}</Button>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Segmented size="sm" layoutId="kds-station" value={station} onChange={setStation} options={['All', ...STATIONS].map((s) => ({ value: s, label: s }))} className="scrollbar-none max-w-full overflow-x-auto" />
        <div className="text-sm text-muted"><span className="font-semibold text-fg">{active.length}</span> tickets on the line</div>
      </div>

      <LayoutGroup>
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {COLUMNS.map((col) => {
            const tickets = active.filter((o) => o.status === col.status)
            return (
              <section key={col.status} className="flex min-h-[60vh] flex-col rounded-3xl border border-line bg-surface-2/40 p-3">
                <header className="mb-3 flex items-center justify-between px-2 pt-1">
                  <div className="flex items-center gap-2">
                    <span className={cn('size-2.5 rounded-full bg-gradient-to-br', col.accent)} />
                    <h3 className="font-semibold">{col.title}</h3>
                  </div>
                  <span className="rounded-lg bg-surface px-2 py-0.5 text-xs font-bold tabular-nums">{tickets.length}</span>
                </header>
                <div className="flex flex-1 flex-col gap-3">
                  <AnimatePresence mode="popLayout">
                    {tickets.map((o) => <Ticket key={o.id} order={o} col={col} now={now} station={station} />)}
                  </AnimatePresence>
                  {tickets.length === 0 && (
                    <div className="grid flex-1 place-items-center rounded-2xl border border-dashed border-line-strong text-sm text-muted">
                      <div className="flex flex-col items-center gap-2 py-10"><ChefHat className="size-6 opacity-50" />All clear</div>
                    </div>
                  )}
                </div>
              </section>
            )
          })}
        </div>
      </LayoutGroup>
    </div>
  )
}

function Ticket({ order, col, now, station }) {
  const [done, setDone] = useState({})
  const mins = (now - order.createdAt) / 60_000
  const urgency = order.status === 'ready' ? 'ok' : mins > 20 ? 'late' : mins > 10 ? 'warn' : 'ok'
  const Icon = TYPE_ICON[order.type]
  const where = order.tableId ? `Table ${order.tableId}` : order.room ? `Room ${order.room.number}` : order.type === 'takeaway' ? `Pickup ${order.pickupTime ?? 'ASAP'}` : 'Delivery'

  return (
    <motion.article
      layout
      layoutId={order.id}
      initial={{ opacity: 0, scale: 0.9, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 40 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      className={cn('overflow-hidden rounded-2xl border-2 bg-surface shadow-sm', col.ring, urgency === 'late' && 'border-lacquer-500/70 shadow-lg shadow-lacquer-500/10')}
    >
      <div className={cn('h-1 bg-gradient-to-r', col.accent)} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-display text-xl font-semibold">#{order.code.replace('DP', '')}</div>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-muted"><Icon className="size-3.5" />{where}</div>
          </div>
          <div className={cn('flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-sm font-bold tabular-nums', urgency === 'late' ? 'bg-lacquer-500 text-white' : urgency === 'warn' ? 'bg-amber-400/20 text-amber-600 dark:text-amber-300' : 'bg-jade-500/15 text-jade-600 dark:text-jade-300')}>
            {urgency === 'late' && <Flame className="size-3.5" />}
            {elapsed(order.createdAt, now)}
          </div>
        </div>
        <ul className="mt-3 space-y-1.5">
          {order.items.map((it) => {
            const dim = station !== 'All' && it.station !== station
            const checked = done[it.id]
            return (
              <li key={it.id}>
                <button onClick={() => setDone((d) => ({ ...d, [it.id]: !d[it.id] }))} className={cn('flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition hover:bg-surface-2', dim && 'opacity-35')}>
                  <span className="grid size-6 shrink-0 place-items-center rounded-md bg-surface-3 text-xs font-bold">{it.qty}</span>
                  <span className={cn('flex-1 font-medium', checked && 'text-muted line-through')}>{it.name}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted">{it.station}</span>
                </button>
              </li>
            )
          })}
        </ul>
        {order.notes && <p className="mt-2 rounded-lg bg-amber-400/10 px-2.5 py-1.5 text-xs text-amber-700 dark:text-amber-200">📝 {order.notes}</p>}
        <button
          onClick={() => advanceOrder(order.id, col.next)}
          className={cn('mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b py-2.5 text-sm font-bold text-white shadow transition hover:brightness-110 active:scale-[0.98]', col.accent, col.status === 'preparing' && 'text-ink-950', col.status === 'ready' && 'text-ink-950')}
        >
          <CheckCheck className="size-4" /> {col.action}
        </button>
      </div>
    </motion.article>
  )
}
