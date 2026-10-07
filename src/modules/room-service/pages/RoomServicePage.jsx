import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { BedDouble, KeyRound, ArrowRight, Crown, ConciergeBell, CheckCircle2, LogOut, Search, ShoppingBag, CreditCard } from 'lucide-react'
import { Button, Field, Input, QuantityStepper } from '@/core/ui'
import { Reveal } from '@/core/animation/Reveal'
import { SplitText } from '@/core/animation/SplitText'
import { img } from '@/core/lib/image'
import { formatMoney } from '@/core/lib/format'
import { sleep } from '@/core/lib/id'
import { cn } from '@/core/lib/cn'
import { useDocumentTitle } from '@/core/hooks'
import { ORDER_TYPES, PAYMENT_METHODS } from '@/core/config/app.config'
import { usePmsStore } from '@/modules/hotel-pms'
import { useCartStore, useCartTotals, placeOrder, MenuBrowser, TotalsBlock } from '@/modules/ordering'

export default function RoomServicePage() {
  useDocumentTitle('Room Service')
  const room = useCartStore((s) => s.room)
  const guest = usePmsStore((s) => (room.number ? s.findGuest(room.number, room.guestName) : null))
  const verified = !!guest && room.verified

  return (
    <AnimatePresence mode="wait">
      {verified ? <RoomMenu key="menu" guest={guest} /> : <VerifyRoom key="verify" />}
    </AnimatePresence>
  )
}

function VerifyRoom() {
  const setRoom = useCartStore((s) => s.setRoom)
  const findGuest = usePmsStore((s) => s.findGuest)
  const [number, setNumber] = useState('504')
  const [name, setName] = useState('Naveen Kumar')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    await sleep(900)
    const g = findGuest(number, name)
    setLoading(false)
    if (!g) return setError("We couldn't match that room and name with our in-house guest list.")
    setRoom({ number: g.room, guestName: g.name, verified: true })
    toast.success(`Welcome, ${g.title} ${g.name.split(' ')[0]}!`)
  }

  return (
    <motion.section exit={{ opacity: 0, y: -30 }} className="grain relative flex min-h-dvh items-center overflow-hidden pt-24">
      <img src={img('interiorDark', { w: 1920, q: 65 })} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40" />
      <div className="container-x relative grid items-center gap-12 py-16 lg:grid-cols-2">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.32em] text-gold-400">In-Room Dining · 客房送餐</div>
          <SplitText as="h1" text={'Order Food to *Your Room*'} className="mt-5 font-display text-5xl leading-[0.95] tracking-tight text-pearl-50 md:text-7xl" />
          <p className="mt-6 max-w-md text-lg text-pearl-200/80">Staying at The Grand Meridian? Browse the full Dragon Pearl menu and charge it straight to your room.</p>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-pearl-200/80">
            {['Browse menu', 'Add items', 'Confirm order'].map((s, i) => (
              <span key={s} className="flex items-center gap-2"><span className="grid size-7 place-items-center rounded-full border border-gold-400/50 font-display text-gold-300">{i + 1}</span>{s}</span>
            ))}
          </div>
        </div>
        <Reveal>
          <form onSubmit={submit} className="glass rounded-3xl border border-line p-7 sm:p-9">
            <ConciergeBell className="size-9 text-gold-400" />
            <h2 className="mt-4 font-display text-3xl">Verify your stay</h2>
            <p className="mt-1 text-sm text-muted">We check your room against the hotel's guest list (PMS).</p>
            <div className="mt-6 space-y-4">
              <Field label="Room Number"><Input icon={BedDouble} value={number} onChange={(e) => setNumber(e.target.value)} placeholder="504" /></Field>
              <Field label="Guest Name"><Input icon={KeyRound} value={name} onChange={(e) => setName(e.target.value)} placeholder="Name on reservation" /></Field>
            </div>
            {error && <p className="mt-3 text-sm text-lacquer-300">{error}</p>}
            <Button type="submit" size="lg" className="mt-6 w-full" loading={loading} iconRight={ArrowRight}>Continue</Button>
            <p className="mt-4 text-center text-xs text-muted">Demo rooms: 504 · 312 · 708 · 215 · 901 · 606</p>
          </form>
        </Reveal>
      </div>
    </motion.section>
  )
}

function RoomMenu({ guest }) {
  const navigate = useNavigate()
  const { setOrderType, setRoom, setCoupon, clear, setQty } = useCartStore()
  const { lines, totals, couponDiscount } = useCartTotals({ type: ORDER_TYPES.ROOM_SERVICE })
  const [method, setMethod] = useState(PAYMENT_METHODS.ROOM_CHARGE)
  const [placing, setPlacing] = useState(false)
  const [placed, setPlaced] = useState(null)

  useEffect(() => {
    setOrderType(ORDER_TYPES.ROOM_SERVICE)
    setCoupon('HOTEL10')
  }, [setOrderType, setCoupon])

  const confirm = async () => {
    setPlacing(true)
    await sleep(1100)
    const order = placeOrder({
      type: ORDER_TYPES.ROOM_SERVICE,
      lines,
      customer: { name: guest.name, mobile: '', email: '' },
      room: { number: guest.room, guestName: guest.name },
      paymentMethod: method,
      discount: couponDiscount,
      couponCode: 'HOTEL10',
      source: 'room-service',
    })
    clear()
    setPlacing(false)
    setPlaced(order)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-x pb-28 pt-28">
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-line">
        <img src={img('fineDining', { w: 1600, h: 500 })} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-transparent" />
        <div className="relative flex flex-wrap items-end justify-between gap-6 p-7 sm:p-10">
          <div>
            <div className="flex items-center gap-2 text-sm text-gold-300"><Crown className="size-4" /> Hotel Guest Special · 10% off applied</div>
            <h1 className="mt-3 font-display text-4xl text-pearl-50 sm:text-5xl">Welcome, {guest.title} {guest.name.split(' ')[0]}</h1>
            <div className="mt-2 text-pearl-200/80">Room: <span className="font-semibold text-pearl-50">{guest.room}</span> · {guest.roomType}</div>
          </div>
          <Button variant="outline" size="sm" icon={LogOut} onClick={() => setRoom({ verified: false })} className="border-pearl-100/30 text-pearl-100">Not you?</Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <MenuBrowser compact />
        <aside>
          <div className="sticky top-24 rounded-3xl border border-line bg-surface/80 p-5 backdrop-blur-xl">
            <AnimatePresence mode="wait">
              {placed ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-4 text-center">
                  <CheckCircle2 className="mx-auto size-14 text-jade-300" />
                  <h3 className="mt-4 font-display text-3xl">Order confirmed</h3>
                  <div className="mt-5 space-y-2 rounded-2xl border border-line bg-surface-2/50 p-4 text-left text-sm">
                    <Row k="Room" v={placed.room.number} />
                    <Row k="Order" v={`#${placed.code}`} />
                    <Row k="Total" v={formatMoney(placed.pricing.total)} />
                    <Row k="Payment" v={placed.payment.method === 'room-charge' ? 'Charge to Room' : 'Paid'} />
                  </div>
                  <p className="mt-4 text-xs text-muted">{placed.payment.method === 'room-charge' ? 'The amount has been transferred to your hotel guest folio.' : 'Payment received — thank you!'}</p>
                  <div className="mt-5 grid gap-2">
                    <Button onClick={() => navigate(`/track/${placed.code}`)} iconRight={ArrowRight}>Track Order</Button>
                    <Button variant="ghost" onClick={() => setPlaced(null)}>Order more</Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-2xl">Checkout</h3>
                    <span className="rounded-full bg-violet-500/15 px-2.5 py-1 text-xs font-semibold text-violet-300">Room {guest.room}</span>
                  </div>
                  <div className="scrollbar-thin mt-4 max-h-[34vh] space-y-2 overflow-y-auto" data-lenis-prevent>
                    {lines.length === 0 && <div className="grid place-items-center rounded-2xl border border-dashed border-line-strong py-10 text-sm text-muted"><ShoppingBag className="mb-2 size-6 text-gold-400" />Add dishes from the menu</div>}
                    {lines.map((l) => (
                      <div key={l.id} className="flex items-center gap-2">
                        <span className="min-w-0 flex-1 truncate text-sm">{l.name}</span>
                        <QuantityStepper size="sm" value={l.qty} onChange={(q) => setQty(l, q)} />
                        <span className="w-16 text-right text-sm font-semibold tabular-nums">{formatMoney(l.price * l.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <TotalsBlock totals={totals} className="mt-4 border-t border-line pt-4" />
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {[[PAYMENT_METHODS.ROOM_CHARGE, 'Charge to Room', BedDouble], [PAYMENT_METHODS.CARD, 'Pay now', CreditCard]].map(([m, label, Icon]) => (
                      <button key={m} onClick={() => setMethod(m)} className={cn('flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition', method === m ? 'border-gold-400 bg-gold-400/15 text-gold-200' : 'border-line text-muted')}>
                        <Icon className="size-4" />{label}
                      </button>
                    ))}
                  </div>
                  <Button className="mt-4 w-full" size="lg" disabled={!lines.length} loading={placing} onClick={confirm}>Confirm Order · {formatMoney(totals.total)}</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>
      </div>
      <div className="mt-6 flex items-center gap-2 text-xs text-muted lg:hidden"><Search className="size-3.5" /> Scroll the menu, then confirm your order at the bottom.</div>
    </motion.div>
  )
}

const Row = ({ k, v }) => (
  <div className="flex justify-between"><span className="text-muted">{k}</span><span className="font-semibold">{v}</span></div>
)
