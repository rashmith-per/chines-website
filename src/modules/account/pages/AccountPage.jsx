import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { UserRound, Package, CalendarDays, Heart, TicketPercent, Gift, MapPin, CreditCard, Star, Trash2, Plus, ArrowRight, Crown, Check } from 'lucide-react'
import { Button, Field, Input, Badge, SmartImage, EmptyState, ProgressBar, Avatar } from '@/core/ui'
import { cn } from '@/core/lib/cn'
import { img } from '@/core/lib/image'
import { formatMoney, formatDate, formatDateTime, to12h } from '@/core/lib/format'
import { useDocumentTitle } from '@/core/hooks'
import { PAYMENT_META } from '@/core/config/app.config'
import { useCatalogStore, DishCard } from '@/modules/catalog'
import { useOrdersStore, OrderStatusBadge, OrderTypeBadge, AddToCart } from '@/modules/ordering'
import { useReservationsStore, ReservationStatusBadge } from '@/modules/reservations'
import { useOffersStore, useLoyaltyStore, REWARDS, TIERS } from '@/modules/offers-loyalty'
import { useAccountStore } from '../store/account.store'

const TABS = [
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'reservations', label: 'My Reservations', icon: CalendarDays },
  { id: 'favourites', label: 'Favourite Dishes', icon: Heart },
  { id: 'offers', label: 'Offers', icon: TicketPercent },
  { id: 'loyalty', label: 'Loyalty Points', icon: Gift },
  { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
  { id: 'payments', label: 'Payment History', icon: CreditCard },
]

export default function AccountPage() {
  useDocumentTitle('My Account')
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') ?? 'profile'
  const profile = useAccountStore((s) => s.profile)
  const points = useLoyaltyStore((s) => s.points)

  return (
    <div className="container-x pb-28 pt-32">
      <div className="relative mb-10 overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-lacquer-700/40 via-surface to-surface p-7 sm:p-10">
        <span className="pointer-events-none absolute -right-4 -top-10 font-cjk text-[11rem] leading-none text-gold-300/10">珠</span>
        <div className="relative flex flex-wrap items-center gap-6">
          <Avatar name={profile.name} size="lg" className="size-20 text-2xl" />
          <div className="flex-1">
            <div className="text-[11px] font-bold uppercase tracking-[0.32em] text-gold-400">My Account</div>
            <h1 className="mt-1 font-display text-4xl sm:text-5xl">Hello, {profile.name.split(' ')[0]}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted"><Badge tone="gold"><Crown className="size-3" /> Gold member</Badge> since {formatDate(profile.memberSince, { day: undefined })}</div>
          </div>
          <div className="rounded-2xl border border-gold-400/30 bg-ink-950/30 px-6 py-4 text-right">
            <div className="text-xs uppercase tracking-[0.2em] text-muted">Pearl points</div>
            <div className="font-display text-4xl font-semibold text-gradient-gold">{points.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <nav className="scrollbar-none -mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:px-0">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setParams({ tab: t.id })} className={cn('relative flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition', tab === t.id ? 'text-ink-950' : 'text-muted hover:bg-surface-2 hover:text-fg')}>
              {tab === t.id && <motion.span layoutId="acct-tab" className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold-300 to-gold-500" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <t.icon className="relative size-4" />
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </nav>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="min-w-0">
            {tab === 'profile' && <Profile />}
            {tab === 'orders' && <Orders />}
            {tab === 'reservations' && <Reservations />}
            {tab === 'favourites' && <Favourites />}
            {tab === 'offers' && <Offers />}
            {tab === 'loyalty' && <Loyalty />}
            {tab === 'addresses' && <Addresses />}
            {tab === 'payments' && <Payments />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

const Panel = ({ title, action, children }) => (
  <section className="rounded-3xl border border-line bg-surface/70 p-6">
    <div className="mb-5 flex items-center justify-between gap-3"><h2 className="font-display text-2xl">{title}</h2>{action}</div>
    {children}
  </section>
)

function Profile() {
  const { profile, updateProfile } = useAccountStore()
  const [f, setF] = useState(profile)
  return (
    <Panel title="Profile">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name"><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="Mobile"><Input value={f.mobile} onChange={(e) => setF({ ...f, mobile: e.target.value })} /></Field>
        <Field label="Email"><Input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
        <Field label="Birthday" hint="We'll treat you to dessert 🎂"><Input type="date" value={f.birthday} onChange={(e) => setF({ ...f, birthday: e.target.value })} /></Field>
        <Field label="Dietary preferences" className="sm:col-span-2"><Input value={f.dietary} onChange={(e) => setF({ ...f, dietary: e.target.value })} /></Field>
      </div>
      <Button className="mt-6" icon={Check} onClick={() => { updateProfile(f); toast.success('Profile updated') }}>Save changes</Button>
    </Panel>
  )
}

function useMyOrders() {
  const ids = useAccountStore((s) => s.myOrderIds)
  const orders = useOrdersStore((s) => s.orders)
  return useMemo(() => ids.map((id) => orders.find((o) => o.id === id)).filter(Boolean), [ids, orders])
}

function Orders() {
  const orders = useMyOrders()
  const navigate = useNavigate()
  if (!orders.length) return <Panel title="My Orders"><EmptyState icon={Package} title="No orders yet" action={<Button to="/order">Order now</Button>} /></Panel>
  return (
    <Panel title="My Orders">
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface-2/40 p-4">
            <div className="flex -space-x-3">
              {o.items.slice(0, 3).map((l) => <SmartImage key={l.id} src={img(l.image, { w: 100, h: 100 })} alt="" className="size-12 rounded-full border-2 border-surface" />)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2"><span className="font-semibold">#{o.code}</span><OrderTypeBadge type={o.type} /><OrderStatusBadge status={o.status} /></div>
              <div className="mt-1 truncate text-sm text-muted">{o.items.map((l) => `${l.name} ×${l.qty}`).join(', ')}</div>
              <div className="text-xs text-muted">{formatDateTime(o.createdAt)}</div>
            </div>
            <div className="text-right">
              <div className="font-display text-xl font-semibold">{formatMoney(o.pricing.total)}</div>
              <Button size="xs" variant="subtle" className="mt-1" iconRight={ArrowRight} onClick={() => navigate(`/track/${o.code}`)}>Track</Button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function Reservations() {
  const ids = useAccountStore((s) => s.myReservationIds)
  const all = useReservationsStore((s) => s.reservations)
  const list = ids.map((id) => all.find((r) => r.id === id)).filter(Boolean)
  return (
    <Panel title="My Reservations" action={<Button size="sm" to="/reservations">Book a table</Button>}>
      {list.length === 0 ? <EmptyState icon={CalendarDays} title="No reservations" /> : (
        <div className="grid gap-3 sm:grid-cols-2">
          {list.map((r) => (
            <div key={r.id} className="rounded-2xl border border-line bg-surface-2/40 p-5">
              <div className="flex items-center justify-between"><span className="font-semibold">{r.code}</span><ReservationStatusBadge status={r.status} /></div>
              <div className="mt-3 font-display text-2xl">{formatDate(r.date)} · {to12h(r.time)}</div>
              <div className="mt-1 text-sm text-muted">{r.guests} guests · {r.seating}{r.tableId ? ` · Table ${r.tableId}` : ''}</div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}

function Favourites() {
  const favs = useAccountStore((s) => s.favourites)
  const toggle = useAccountStore((s) => s.toggleFavourite)
  const items = useCatalogStore((s) => s.items)
  const dishes = items.filter((i) => favs.includes(i.id))
  return (
    <Panel title="Favourite Dishes">
      <div className="grid gap-4 sm:grid-cols-2">
        {dishes.map((d) => (
          <div key={d.id} className="relative">
            <DishCard dish={d} variant="row" action={<AddToCart dish={d} size="sm" />} />
            <button onClick={() => toggle(d.id)} className="absolute right-3 top-3 text-lacquer-400" aria-label="Remove favourite"><Heart className="size-4 fill-current" /></button>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function Offers() {
  const offers = useOffersStore((s) => s.offers)
  return (
    <Panel title="Offers for you">
      <div className="grid gap-3 sm:grid-cols-2">
        {offers.filter((o) => o.active).map((o) => (
          <div key={o.id} className="flex gap-4 rounded-2xl border border-line bg-surface-2/40 p-4">
            <SmartImage src={img(o.image, { w: 200, h: 200 })} alt="" className="size-20 shrink-0 rounded-xl" />
            <div className="min-w-0">
              <div className="font-semibold">{o.title}</div>
              <div className="text-sm text-muted">{o.subtitle}</div>
              {o.code && <div className="mt-2 inline-block rounded-lg border border-dashed border-gold-400/50 px-2 py-0.5 text-xs font-bold tracking-widest text-gold-300">{o.code}</div>}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function Loyalty() {
  const { points, history, redeem, rupeeValue } = useLoyaltyStore()
  const next = TIERS[2]
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-gold-400/30 bg-gradient-to-br from-gold-400/15 via-surface to-lacquer-700/20 p-7">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted">Your Points</div>
            <div className="font-display text-6xl font-semibold">{points.toLocaleString('en-IN')} <span className="text-xl text-muted">Points</span></div>
            <div className="mt-1 text-gold-300">{formatMoney(rupeeValue(points))} available reward</div>
          </div>
          <Button variant="gold" icon={Gift} disabled={points < 1250} onClick={() => { if (redeem(1250, 'Redeemed — ₹125 voucher')) toast.success('₹125 voucher added to your wallet') }}>Redeem Points</Button>
        </div>
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs text-muted"><span>Gold</span><span>{next.name} at {next.min.toLocaleString('en-IN')} lifetime pts</span></div>
          <ProgressBar value={4820} max={next.min} />
        </div>
      </div>
      <Panel title="Rewards">
        <div className="grid gap-3 sm:grid-cols-2">
          {REWARDS.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-2xl border border-line p-4">
              <div><div className="font-semibold">{r.name}</div><div className="text-xs text-muted">{r.points} pts · worth {formatMoney(r.value)}</div></div>
              <Button size="xs" variant="outline" disabled={points < r.points} onClick={() => redeem(r.points, `Redeemed — ${r.name}`) && toast.success(`${r.name} unlocked!`)}>Redeem</Button>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Points history">
        <div className="divide-y divide-line">
          {history.map((h) => (
            <div key={h.id} className="flex items-center justify-between py-3 text-sm">
              <div><div className="font-medium">{h.label}</div><div className="text-xs text-muted">{formatDateTime(h.at)}</div></div>
              <span className={cn('font-semibold tabular-nums', h.points > 0 ? 'text-jade-400' : 'text-lacquer-400')}>{h.points > 0 ? '+' : ''}{h.points}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

function Addresses() {
  const { addresses, addAddress, removeAddress, setDefaultAddress } = useAccountStore()
  const [adding, setAdding] = useState(false)
  const [f, setF] = useState({ label: '', line: '', landmark: '', pincode: '' })
  return (
    <Panel title="Saved Addresses" action={<Button size="sm" variant="outline" icon={Plus} onClick={() => setAdding((a) => !a)}>Add address</Button>}>
      <AnimatePresence>
        {adding && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mb-5 grid gap-3 rounded-2xl border border-line p-4 sm:grid-cols-2">
              <Input placeholder="Label (Home, Office…)" value={f.label} onChange={(e) => setF({ ...f, label: e.target.value })} />
              <Input placeholder="Pincode" value={f.pincode} onChange={(e) => setF({ ...f, pincode: e.target.value })} />
              <Input placeholder="Address" className="sm:col-span-2" value={f.line} onChange={(e) => setF({ ...f, line: e.target.value })} />
              <Input placeholder="Landmark" value={f.landmark} onChange={(e) => setF({ ...f, landmark: e.target.value })} />
              <Button onClick={() => { if (!f.line) return; addAddress(f); setF({ label: '', line: '', landmark: '', pincode: '' }); setAdding(false); toast.success('Address saved') }}>Save address</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid gap-3 sm:grid-cols-2">
        {addresses.map((a) => (
          <div key={a.id} className={cn('rounded-2xl border p-5', a.default ? 'border-gold-400/50 bg-gold-400/5' : 'border-line')}>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 font-semibold"><MapPin className="size-4 text-gold-400" />{a.label}</span>{a.default && <Badge tone="gold"><Star className="size-3" /> Default</Badge>}</div>
            <p className="mt-2 text-sm text-muted">{a.line}<br />{a.landmark} · {a.pincode}</p>
            <div className="mt-4 flex gap-2">
              {!a.default && <Button size="xs" variant="subtle" onClick={() => setDefaultAddress(a.id)}>Make default</Button>}
              <Button size="xs" variant="danger" icon={Trash2} onClick={() => removeAddress(a.id)}>Remove</Button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function Payments() {
  const orders = useMyOrders()
  return (
    <Panel title="Payment History">
      <div className="overflow-hidden rounded-2xl border border-line">
        {orders.map((o) => (
          <div key={o.id} className="flex items-center justify-between border-b border-line px-4 py-3.5 text-sm last:border-0">
            <div><div className="font-semibold">#{o.code}</div><div className="text-xs text-muted">{formatDateTime(o.createdAt)}</div></div>
            <div className="text-muted">{PAYMENT_META[o.payment.method]?.label}</div>
            <Badge tone={o.payment.status === 'pending' ? 'amber' : 'jade'}>{o.payment.status === 'pending' ? 'Due' : o.payment.status === 'room-charged' ? 'Room folio' : 'Paid'}</Badge>
            <div className="font-semibold tabular-nums">{formatMoney(o.pricing.total)}</div>
          </div>
        ))}
      </div>
    </Panel>
  )
}
