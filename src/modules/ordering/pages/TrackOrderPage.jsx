import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Clock, MapPin, BedDouble, Utensils, ShoppingBag, PartyPopper, MonitorPlay, Receipt } from 'lucide-react'
import { Button, Input, Switch, SmartImage, EmptyState } from '@/core/ui'
import { Reveal } from '@/core/animation/Reveal'
import { img } from '@/core/lib/image'
import { formatMoney, formatTime } from '@/core/lib/format'
import { useDocumentTitle, useInterval, useNow } from '@/core/hooks'
import { PAYMENT_META } from '@/core/config/app.config'
import { useOrdersStore, nextStatus } from '../store/orders.store'
import { advanceOrder } from '../services/order.service'
import { OrderStatusStepper, OrderTypeBadge, OrderStatusBadge, TotalsBlock } from '../components/OrderBits'

const ETA_MIN = { 'dine-in': 20, takeaway: 20, delivery: 30, 'room-service': 25 }

export default function TrackOrderPage() {
  const { orderId } = useParams()
  useDocumentTitle(orderId ? `Order ${orderId}` : 'Track Order')
  const order = useOrdersStore((s) => s.orders.find((o) => o.code.toLowerCase() === (orderId ?? '').toLowerCase()))
  const [simulate, setSimulate] = useState(true)
  const now = useNow(1000)

  // Demo: if nobody is driving the KDS, nudge the order forward so the tracker comes alive.
  useInterval(
    () => {
      const next = nextStatus(order.status)
      if (next) advanceOrder(order.id, next)
    },
    simulate && order && !['completed', 'cancelled'].includes(order.status) ? 9000 : null,
  )

  if (!orderId) return <Lookup />
  if (!order) {
    return (
      <div className="container-x pb-24 pt-40">
        <EmptyState icon={Search} title={`We couldn't find ${orderId}`} description="Check the order number on your confirmation message." action={<Lookup inline />} />
      </div>
    )
  }

  const eta = ETA_MIN[order.type]
  const elapsedMin = Math.floor((now - order.createdAt) / 60000)
  const remaining = Math.max(0, eta - elapsedMin)
  const pct = order.status === 'completed' || order.status === 'ready' ? 1 : Math.min(0.95, elapsedMin / eta)

  return (
    <div className="container-x pb-28 pt-32">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <Reveal className="relative overflow-hidden rounded-3xl border border-line bg-surface/80 p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-lacquer-500/15 blur-3xl" />
            <div className="relative flex flex-wrap items-start justify-between gap-6">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.32em] text-gold-400">Order Tracking</div>
                <h1 className="mt-2 font-display text-5xl tracking-tight">#{order.code}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <OrderTypeBadge type={order.type} />
                  <OrderStatusBadge status={order.status} />
                  <span className="text-xs text-muted">Placed {formatTime(order.createdAt)}</span>
                </div>
              </div>
              <EtaRing pct={pct} remaining={remaining} status={order.status} eta={eta} />
            </div>

            <div className="relative mt-10 hidden sm:block">
              <OrderStatusStepper order={order} />
            </div>
            <div className="relative mt-8 sm:hidden">
              <OrderStatusStepper order={order} orientation="vertical" />
            </div>

            <AnimatePresence>
              {(order.status === 'ready' || order.status === 'completed') && (
                <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="relative mt-8 flex items-center gap-4 rounded-2xl border border-jade-400/30 bg-jade-500/10 p-4">
                  <PartyPopper className="size-8 shrink-0 text-jade-300" />
                  <div>
                    <div className="font-semibold text-jade-200">{order.status === 'ready' ? readyCopy(order.type) : 'Order completed — enjoy your meal!'}</div>
                    <div className="text-sm text-muted">We've sent an update on WhatsApp & SMS.</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Reveal>

          <Reveal className="rounded-3xl border border-line bg-surface/70 p-6">
            <h2 className="font-display text-2xl">Order details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Detail icon={Receipt} label="Customer" value={order.customer?.name} sub={order.customer?.mobile} />
              {order.type === 'delivery' && <Detail icon={MapPin} label="Delivery to" value={order.delivery?.address} sub={[order.delivery?.landmark, order.delivery?.pincode].filter(Boolean).join(' · ')} />}
              {order.type === 'takeaway' && <Detail icon={ShoppingBag} label="Pickup" value={order.pickupTime} sub="Dragon Pearl, Ground Floor" />}
              {order.type === 'room-service' && <Detail icon={BedDouble} label="Room service" value={`Room ${order.room?.number}`} sub={order.room?.guestName} />}
              {order.type === 'dine-in' && <Detail icon={Utensils} label="Dine-in" value={order.tableId ? `Table ${order.tableId}` : 'Table to be assigned'} sub={order.waiter} />}
              <Detail icon={Clock} label="Payment" value={PAYMENT_META[order.payment.method]?.label} sub={order.payment.status === 'room-charged' ? 'Posted to guest folio' : order.payment.status === 'paid' ? 'Paid' : 'Due on collection'} />
            </div>
          </Reveal>
        </div>

        <aside className="space-y-4">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-3xl border border-line bg-surface/80 p-5">
              <h3 className="font-display text-xl">Items</h3>
              <div className="mt-4 space-y-3">
                {order.items.map((l) => (
                  <div key={l.id} className="flex items-center gap-3">
                    <SmartImage src={img(l.image, { w: 100, h: 100 })} alt="" className="size-10 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1 truncate text-sm">
                      {l.name} <span className="text-muted">× {l.qty}</span>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">{formatMoney(l.price * l.qty)}</span>
                  </div>
                ))}
              </div>
              <TotalsBlock totals={order.pricing} className="mt-5 border-t border-line pt-4" />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-line-strong p-4">
              <div className="flex items-start gap-3">
                <MonitorPlay className="mt-0.5 size-5 text-gold-400" />
                <div>
                  <div className="text-sm font-semibold">Simulate kitchen</div>
                  <div className="text-xs text-muted">Or open the KDS in another tab and drive it live.</div>
                </div>
              </div>
              <Switch checked={simulate} onChange={setSimulate} label="Simulate kitchen" />
            </div>
            <Button to="/order" variant="outline" className="w-full">Order something else</Button>
          </div>
        </aside>
      </div>
    </div>
  )
}

const readyCopy = (type) =>
  ({ takeaway: 'Your order is ready for pickup!', delivery: 'Packed and handed to our rider!', 'room-service': 'On its way to your room!', 'dine-in': 'Your food is on its way to your table!' })[type]

function EtaRing({ pct, remaining, status, eta }) {
  const r = 44
  const c = 2 * Math.PI * r
  return (
    <div className="relative grid size-32 place-items-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--line-strong)" strokeWidth="6" />
        <motion.circle cx="50" cy="50" r={r} fill="none" stroke="url(#eta)" strokeWidth="6" strokeLinecap="round" strokeDasharray={c} animate={{ strokeDashoffset: c * (1 - pct) }} transition={{ duration: 1 }} />
        <defs>
          <linearGradient id="eta">
            <stop offset="0" stopColor="#ecc983" />
            <stop offset="1" stopColor="#55b399" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center">
        {['ready', 'completed'].includes(status) ? (
          <div className="font-display text-xl text-jade-300">Ready</div>
        ) : (
          <>
            <div className="font-display text-3xl tabular-nums">{remaining}</div>
            <div className="text-[10px] uppercase tracking-widest text-muted">min left</div>
          </>
        )}
        <div className="mt-0.5 text-[10px] text-muted">ETA {eta}–{eta + 5} min</div>
      </div>
    </div>
  )
}

function Detail({ icon: Icon, label, value, sub }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface-2/40 p-4">
      <Icon className="mt-0.5 size-5 shrink-0 text-gold-400" />
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</div>
        <div className="mt-0.5 truncate font-semibold">{value || '—'}</div>
        {sub && <div className="truncate text-sm text-muted">{sub}</div>}
      </div>
    </div>
  )
}

function Lookup({ inline }) {
  const [code, setCode] = useState('')
  const navigate = useNavigate()
  const orders = useOrdersStore((s) => s.orders)
  const recent = orders.filter((o) => o.source !== 'pos').slice(0, 4)
  const form = (
    <form onSubmit={(e) => { e.preventDefault(); if (code.trim()) navigate(`/track/${code.trim().toUpperCase()}`) }} className="flex w-full max-w-md gap-2">
      <Input icon={Search} placeholder="Order number, e.g. DP10245" value={code} onChange={(e) => setCode(e.target.value)} />
      <Button type="submit">Track Order</Button>
    </form>
  )
  if (inline) return form
  return (
    <div className="container-x flex min-h-[80vh] flex-col items-center justify-center pb-20 pt-36 text-center">
      <div className="text-[11px] font-bold uppercase tracking-[0.32em] text-gold-400">Track Order</div>
      <h1 className="mt-3 font-display text-5xl tracking-tight md:text-6xl">Where's my food?</h1>
      <p className="mt-4 max-w-md text-muted">Enter your order number to see live status from our kitchen.</p>
      <div className="mt-8 flex w-full justify-center">{form}</div>
      <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-muted">
        Recent:
        {recent.map((o) => (
          <button key={o.id} onClick={() => navigate(`/track/${o.code}`)} className="rounded-lg border border-line px-2 py-0.5 font-semibold hover:border-gold-400/50 hover:text-gold-300">
            {o.code}
          </button>
        ))}
      </div>
    </div>
  )
}
