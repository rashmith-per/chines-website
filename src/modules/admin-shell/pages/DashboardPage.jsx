import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ShoppingCart, Utensils, ShoppingBag, Bike, BedDouble, IndianRupee, Clock, CalendarDays, ArrowRight, MonitorSmartphone, ChefHat, AlertTriangle, Flame, TrendingUp } from 'lucide-react'
import { Card, CardHeader, StatCard, Button, Badge, Avatar } from '@/core/ui'
import { axisProps, gridProps, ChartTooltip } from '@/core/charts/ChartKit'
import { formatMoney, formatCompact, timeAgo, to12h, todayISO } from '@/core/lib/format'
import { useDocumentTitle, useNow } from '@/core/hooks'
import { ORDER_TYPE_META, CHART_SERIES_ORDER } from '@/core/config/app.config'
import { useCurrentUser } from '@/modules/auth'
import { useOrdersStore, OrderStatusBadge, OrderTypeBadge } from '@/modules/ordering'
import { useReservationsStore, ReservationStatusBadge } from '@/modules/reservations'
import { useTablesStore, FloorPlan } from '@/modules/tables'
import { useInventoryStore, stockStatus } from '@/modules/inventory'

export default function DashboardPage() {
  useDocumentTitle('Dashboard')
  const user = useCurrentUser()
  const now = useNow(30000)
  const orders = useOrdersStore((s) => s.orders)
  const reservations = useReservationsStore((s) => s.reservations)
  const tables = useTablesStore((s) => s.tables)
  const inventory = useInventoryStore((s) => s.items)

  const today = useMemo(() => orders.filter((o) => now - o.createdAt < 24 * 3600_000 && o.status !== 'cancelled'), [orders, now])
  const byType = (t) => today.filter((o) => o.type === t).length
  const revenue = today.reduce((s, o) => s + o.pricing.total, 0)
  const pending = today.filter((o) => !['completed', 'cancelled'].includes(o.status))
  const todaysRes = reservations.filter((r) => r.date === todayISO() && r.status !== 'cancelled').sort((a, b) => a.time.localeCompare(b.time))
  const low = inventory.filter((i) => stockStatus(i) !== 'ok')

  const hourly = useMemo(() => {
    const buckets = Array.from({ length: 12 }, (_, i) => {
      const h = new Date(now - (11 - i) * 3600_000)
      return { hour: h.getHours(), label: to12h(`${h.getHours()}:00`).replace(':00', ''), revenue: 0 }
    })
    today.forEach((o) => {
      const idx = 11 - Math.floor((now - o.createdAt) / 3600_000)
      if (idx >= 0 && idx < 12) buckets[idx].revenue += o.pricing.total
    })
    return buckets.map((b) => ({ ...b, revenue: Math.round(b.revenue) }))
  }, [today, now])

  const topDishes = useMemo(() => {
    const m = {}
    today.forEach((o) => o.items.forEach((l) => (m[l.name] = (m[l.name] ?? 0) + l.qty)))
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [today])

  const greeting = new Date(now).getHours() < 12 ? 'Good morning' : new Date(now).getHours() < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-sm text-muted">{new Date(now).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight md:text-4xl">{greeting}, {user?.name.split(' ')[0]} <span className="font-cjk text-gold-500 dark:text-gold-300">歡迎</span></h1>
          <p className="mt-1 text-sm text-muted">Today's Overview — here's how Dragon Pearl is doing right now.</p>
        </motion.div>
        <div className="flex flex-wrap gap-2">
          <Button to="/admin/pos" icon={MonitorSmartphone}>New Bill</Button>
          <Button to="/admin/kds" variant="subtle" icon={ChefHat}>Kitchen</Button>
          <Button to="/admin/reservations" variant="subtle" icon={CalendarDays}>Reservations</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard index={0} label="Total Orders" value={today.length} icon={ShoppingCart} trend={9.4} hint="vs yesterday" />
        <StatCard index={1} label="Revenue" value={revenue} format={(n) => formatMoney(n)} icon={IndianRupee} accent="jade" trend={12.1} hint="vs yesterday" />
        <StatCard index={2} label="Pending Orders" value={pending.length} icon={Clock} accent="amber" hint="in the kitchen pipeline" />
        <StatCard index={3} label="Reservations" value={todaysRes.length} icon={CalendarDays} accent="violet" hint={`${todaysRes.reduce((n, r) => n + Number(r.guests), 0)} covers tonight`} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[['dine-in', Utensils], ['takeaway', ShoppingBag], ['delivery', Bike], ['room-service', BedDouble]].map(([t, Icon], i) => (
          <motion.div key={t} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
            <Card className="flex items-center gap-4 p-4">
              <span className="grid size-11 place-items-center rounded-xl" style={{ background: `color-mix(in oklab, ${ORDER_TYPE_META[t].color} 15%, transparent)`, color: ORDER_TYPE_META[t].color }}><Icon className="size-5" /></span>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{ORDER_TYPE_META[t].label}</div>
                <div className="font-display text-2xl font-semibold">{byType(t)}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader title="Revenue — last 12 hours" subtitle={`${formatMoney(revenue)} today`} icon={TrendingUp} action={<Badge tone="jade" dot>Live</Badge>} />
          <div className="h-72 px-2 pb-3 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourly} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c08428" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#c08428" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="label" {...axisProps} />
                <YAxis {...axisProps} width={48} tickFormatter={(v) => `₹${formatCompact(v)}`} />
                <Tooltip cursor={{ stroke: 'var(--line-strong)', strokeWidth: 1 }} content={<ChartTooltip format={(v) => formatMoney(v)} />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#c08428" strokeWidth={2} fill="url(#rev-fill)" activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--surface)' }} animationDuration={1200} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="Order mix" subtitle="Share of today's orders" icon={ShoppingCart} />
          <div className="space-y-4 p-5">
            {CHART_SERIES_ORDER.map((t, i) => {
              const n = byType(t)
              const pct = today.length ? (n / today.length) * 100 : 0
              return (
                <div key={t}>
                  <div className="mb-1.5 flex justify-between text-sm"><span className="flex items-center gap-2 text-muted"><span className="size-2.5 rounded-sm" style={{ background: ORDER_TYPE_META[t].color }} />{ORDER_TYPE_META[t].label}</span><span className="font-semibold tabular-nums">{n} <span className="text-xs font-normal text-muted">{Math.round(pct)}%</span></span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-3"><motion.div className="h-full rounded-full" style={{ background: ORDER_TYPE_META[t].color }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: i * 0.08 }} /></div>
                </div>
              )
            })}
            <div className="mt-2 border-t border-line pt-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted"><Flame className="size-3.5 text-lacquer-500" /> Top dishes today</div>
              {topDishes.map(([name, qty]) => (
                <div key={name} className="flex justify-between py-1 text-sm"><span>{name}</span><span className="font-semibold tabular-nums">{qty}</span></div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <CardHeader title="Live orders" subtitle={`${pending.length} in progress`} icon={ChefHat} action={<Link to="/admin/orders" className="text-xs font-semibold text-gold-600 hover:underline dark:text-gold-300">View all</Link>} />
          <div className="scrollbar-thin mt-3 max-h-[26rem] space-y-1 overflow-y-auto px-3 pb-3">
            {pending.map((o) => (
              <Link key={o.id} to="/admin/orders" className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-surface-2/60">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm font-semibold">#{o.code}<OrderTypeBadge type={o.type} /></div>
                  <div className="truncate text-xs text-muted">{o.items.map((l) => `${l.qty}× ${l.name}`).join(', ')}</div>
                </div>
                <div className="text-right"><OrderStatusBadge status={o.status} /><div className="mt-1 text-[10px] text-muted">{timeAgo(o.createdAt)}</div></div>
              </Link>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Today's reservations" subtitle={`${todaysRes.length} bookings`} icon={CalendarDays} action={<Link to="/admin/reservations" className="text-xs font-semibold text-gold-600 hover:underline dark:text-gold-300">Manage</Link>} />
          <div className="mt-3 space-y-1 px-3 pb-3">
            {todaysRes.slice(0, 7).map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5">
                <div className="w-16 font-display text-base font-semibold">{to12h(r.time)}</div>
                <Avatar name={r.name} size="sm" />
                <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{r.name}</div><div className="text-xs text-muted">{r.guests} guests · {r.tableId ?? 'Unassigned'}</div></div>
                <ReservationStatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-5">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">Floor</h3><Link to="/admin/tables" className="flex items-center gap-1 text-xs font-semibold text-gold-600 dark:text-gold-300">Open <ArrowRight className="size-3" /></Link></div>
            <FloorPlan tables={tables} compact />
          </Card>
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2"><AlertTriangle className="size-4 text-amber-500" /><h3 className="font-semibold">Low stock</h3><Badge tone="amber">{low.length}</Badge></div>
            {low.slice(0, 5).map((i) => (
              <div key={i.id} className="flex justify-between py-1.5 text-sm"><span>{i.name}</span><span className="font-semibold text-amber-600 dark:text-amber-300">{i.stock} {i.unit} <span className="text-xs font-normal text-muted">/ min {i.min}</span></span></div>
            ))}
            <Button to="/admin/inventory" variant="subtle" size="sm" className="mt-3 w-full">Go to inventory</Button>
          </Card>
        </div>
      </div>
    </>
  )
}
