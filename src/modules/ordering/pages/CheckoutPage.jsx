import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { BadgeCheck, BedDouble, Banknote, CreditCard, Smartphone, Store, TicketPercent, Gift, ShieldCheck, Loader2, AlertCircle, ShoppingBag } from 'lucide-react'
import { Button, Field, Input, SmartImage, Switch, EmptyState } from '@/core/ui'
import { Reveal } from '@/core/animation/Reveal'
import { cn } from '@/core/lib/cn'
import { img } from '@/core/lib/image'
import { formatMoney } from '@/core/lib/format'
import { sleep } from '@/core/lib/id'
import { useDocumentTitle } from '@/core/hooks'
import { ORDER_TYPES, PAYMENT_METHODS } from '@/core/config/app.config'
import { useOffersStore, useLoyaltyStore } from '@/modules/offers-loyalty'
import { usePmsStore } from '@/modules/hotel-pms'
import { useCartStore } from '../store/cart.store'
import { useCartTotals } from '../hooks/useCartTotals'
import { placeOrder } from '../services/order.service'
import { TotalsBlock } from '../components/OrderBits'
import { OrderTypeSelector, OrderTypeDetails } from '../components/OrderTypeOptions'

const PAYMENT_OPTIONS = {
  [PAYMENT_METHODS.UPI]: { label: 'UPI', hint: 'GPay, PhonePe, Paytm', icon: Smartphone },
  [PAYMENT_METHODS.CARD]: { label: 'Card', hint: 'Credit / debit', icon: CreditCard },
  [PAYMENT_METHODS.CASH]: { label: 'Cash', hint: 'Pay on delivery', icon: Banknote },
  [PAYMENT_METHODS.PAY_AT_RESTAURANT]: { label: 'Pay at Restaurant', hint: 'At the counter', icon: Store },
  [PAYMENT_METHODS.ROOM_CHARGE]: { label: 'Charge to Hotel Room', hint: 'Added to your folio', icon: BedDouble },
}

const METHODS_BY_TYPE = {
  [ORDER_TYPES.DINE_IN]: ['upi', 'card', 'pay-at-restaurant', 'room-charge'],
  [ORDER_TYPES.TAKEAWAY]: ['upi', 'card', 'pay-at-restaurant'],
  [ORDER_TYPES.DELIVERY]: ['upi', 'card', 'cash'],
  [ORDER_TYPES.ROOM_SERVICE]: ['room-charge', 'upi', 'card'],
}

export default function CheckoutPage() {
  useDocumentTitle('Checkout')
  const navigate = useNavigate()
  const cart = useCartStore()
  const { customer, setCustomer, orderType, setOrderType, room, setRoom } = cart
  const [usePoints, setUsePoints] = useState(false)
  const points = useLoyaltyStore((s) => s.points)
  const pointsValue = useLoyaltyStore((s) => s.rupeeValue)(points)
  const { lines, totals, offer, couponDiscount } = useCartTotals({ extraDiscount: usePoints ? pointsValue : 0 })
  const [method, setMethod] = useState(METHODS_BY_TYPE[orderType][0])
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState({})

  const needsRoom = orderType === ORDER_TYPES.ROOM_SERVICE || method === PAYMENT_METHODS.ROOM_CHARGE
  const guest = usePmsStore((s) => (needsRoom && room.number ? s.findGuest(room.number, room.guestName) : null))

  const chooseType = (t) => {
    setOrderType(t)
    setMethod(METHODS_BY_TYPE[t][0])
  }

  const validate = () => {
    const e = {}
    if (!customer.name.trim()) e.name = 'Please enter your name'
    if (customer.mobile.replace(/\D/g, '').length < 10) e.mobile = 'Enter a valid 10-digit mobile number'
    if (orderType === ORDER_TYPES.DELIVERY) {
      if (!cart.delivery.address.trim()) e.address = 'Delivery address is required'
      if (!/^\d{6}$/.test(cart.delivery.pincode)) e.pincode = 'Enter a 6-digit pincode'
    }
    if (needsRoom && !guest) e.room = 'We could not match this room and guest name'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) {
      toast.error('Please check the highlighted fields')
      return
    }
    setProcessing(true)
    await sleep(method === 'upi' || method === 'card' ? 1600 : 900)
    const order = placeOrder({
      type: orderType,
      lines,
      customer,
      delivery: { ...cart.delivery, mobile: cart.delivery.mobile || customer.mobile },
      pickupTime: cart.pickupTime,
      tableId: orderType === ORDER_TYPES.DINE_IN ? cart.tableId || undefined : undefined,
      room: needsRoom ? { number: guest.room, guestName: guest.name } : undefined,
      paymentMethod: method,
      discount: couponDiscount + (usePoints ? pointsValue : 0),
      couponCode: offer?.code,
      source: orderType === ORDER_TYPES.ROOM_SERVICE ? 'room-service' : 'web',
    })
    if (usePoints) useLoyaltyStore.getState().redeem(points, `Redeemed on ${order.code}`)
    if (offer?.code) useOffersStore.getState().recordRedemption(offer.code)
    cart.clear()
    setProcessing(false)
    toast.success(`Order ${order.code} placed!`, { description: 'Sit back — the kitchen has your order.' })
    navigate(`/track/${order.code}`)
  }

  if (!lines.length && !processing) {
    return (
      <div className="container-x pb-24 pt-40">
        <EmptyState icon={ShoppingBag} title="Nothing to check out yet" description="Your cart is empty. Add some dishes first." action={<Button to="/order" variant="gold">Browse the menu</Button>} />
      </div>
    )
  }

  return (
    <div className="container-x pb-28 pt-32">
      <Reveal>
        <div className="text-[11px] font-bold uppercase tracking-[0.32em] text-gold-400">Checkout · 結帳</div>
        <h1 className="mt-3 font-display text-5xl tracking-tight md:text-6xl">Almost there.</h1>
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-6">
          <Section step="01" title="Customer Details">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Name" required error={errors.name}>
                <Input value={customer.name} onChange={(e) => setCustomer({ name: e.target.value })} />
              </Field>
              <Field label="Mobile" required error={errors.mobile}>
                <Input inputMode="tel" value={customer.mobile} onChange={(e) => setCustomer({ mobile: e.target.value })} />
              </Field>
              <Field label="Email">
                <Input type="email" value={customer.email} onChange={(e) => setCustomer({ email: e.target.value })} />
              </Field>
            </div>
          </Section>

          <Section step="02" title="Order Type">
            <OrderTypeSelector types={[ORDER_TYPES.DINE_IN, ORDER_TYPES.TAKEAWAY, ORDER_TYPES.DELIVERY, ORDER_TYPES.ROOM_SERVICE]} value={orderType} onChange={chooseType} />
            {orderType !== ORDER_TYPES.ROOM_SERVICE && <OrderTypeDetails type={orderType} />}
            {(errors.address || errors.pincode) && <p className="mt-3 flex items-center gap-1.5 text-xs text-lacquer-400"><AlertCircle className="size-3.5" />{errors.address || errors.pincode}</p>}
            <AnimatePresence>
              {needsRoom && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="mt-5 grid gap-4 rounded-2xl border border-violet-400/25 bg-violet-500/5 p-4 sm:grid-cols-2">
                    <Field label="Hotel Room Number" required>
                      <Input icon={BedDouble} placeholder="e.g. 504" value={room.number} onChange={(e) => setRoom({ number: e.target.value })} />
                    </Field>
                    <Field label="Guest Name" required>
                      <Input placeholder="As registered at check-in" value={room.guestName} onChange={(e) => setRoom({ guestName: e.target.value })} />
                    </Field>
                    <div className="sm:col-span-2">
                      {guest ? (
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-sm text-jade-300">
                          <BadgeCheck className="size-4" /> Verified with hotel PMS — {guest.title} {guest.name}, {guest.roomType}
                        </motion.div>
                      ) : (
                        <p className={cn('text-xs', errors.room ? 'text-lacquer-400' : 'text-muted')}>
                          {errors.room ?? 'Demo rooms: 504 Naveen Kumar · 312 Isha Malhotra · 708 David Miller · 901 Kenji Watanabe'}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Section>

          <Section step="03" title="Payment">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {METHODS_BY_TYPE[orderType].map((m) => {
                const opt = PAYMENT_OPTIONS[m]
                const active = method === m
                return (
                  <button key={m} type="button" onClick={() => setMethod(m)} className={cn('flex items-center gap-3 rounded-2xl border p-4 text-left transition-all', active ? 'border-gold-400/70 bg-gold-400/10' : 'border-line hover:border-line-strong')}>
                    <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', active ? 'bg-gold-400 text-ink-950' : 'bg-surface-2 text-muted')}>
                      <opt.icon className="size-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{opt.label}</span>
                      <span className="block text-xs text-muted">{opt.hint}</span>
                    </span>
                  </button>
                )
              })}
            </div>
            {method === PAYMENT_METHODS.ROOM_CHARGE && (
              <p className="mt-4 text-sm text-muted">After checkout, the amount is transferred to your hotel guest folio and settled with your room bill.</p>
            )}
          </Section>
        </div>

        <aside>
          <div className="sticky top-24 space-y-4">
            <div className="rounded-3xl border border-line bg-surface/80 p-5 backdrop-blur-xl">
              <h3 className="font-display text-2xl">Your Order</h3>
              <div className="scrollbar-thin mt-4 max-h-64 space-y-3 overflow-y-auto pr-1" data-lenis-prevent>
                {lines.map((l) => (
                  <div key={l.id} className="flex items-center gap-3">
                    <SmartImage src={img(l.image, { w: 100, h: 100 })} alt="" className="size-11 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{l.name}</div>
                      <div className="text-xs text-muted">Qty {l.qty}</div>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">{formatMoney(l.price * l.qty)}</span>
                  </div>
                ))}
              </div>
              <CouponBox />
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-line bg-surface-2/50 p-3.5">
                <div className="flex items-center gap-3">
                  <Gift className="size-5 text-gold-400" />
                  <div>
                    <div className="text-sm font-semibold">Use {points.toLocaleString('en-IN')} points</div>
                    <div className="text-xs text-muted">Save {formatMoney(pointsValue)}</div>
                  </div>
                </div>
                <Switch checked={usePoints} onChange={setUsePoints} label="Redeem loyalty points" disabled={!points} />
              </div>
              <TotalsBlock totals={totals} className="mt-5 border-t border-line pt-4" />
              <Button className="mt-5 w-full" size="lg" onClick={submit} disabled={processing}>
                {processing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> {method === 'upi' ? 'Awaiting UPI confirmation…' : 'Placing order…'}
                  </>
                ) : (
                  <>Place Order · {formatMoney(totals.total)}</>
                )}
              </Button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
                <ShieldCheck className="size-3.5" /> Secure checkout · GST invoice included
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Section({ step, title, children }) {
  return (
    <Reveal className="rounded-3xl border border-line bg-surface/70 p-5 sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <span className="font-display text-sm italic text-gold-400">{step}</span>
        <h2 className="font-display text-2xl">{title}</h2>
      </div>
      {children}
    </Reveal>
  )
}

function CouponBox() {
  const couponCode = useCartStore((s) => s.couponCode)
  const setCoupon = useCartStore((s) => s.setCoupon)
  const offers = useOffersStore((s) => s.offers)
  const findByCode = useOffersStore((s) => s.findByCode)
  const [code, setCode] = useState(couponCode ?? '')
  const suggestions = useMemo(() => offers.filter((o) => o.active && o.code).slice(0, 4), [offers])

  const apply = (c = code) => {
    const offer = findByCode(c)
    if (!offer) return toast.error('That code is not valid')
    setCoupon(offer.code)
    setCode(offer.code)
    toast.success(`${offer.code} applied`, { description: offer.subtitle })
  }

  return (
    <div className="mt-4 border-t border-line pt-4">
      <div className="flex gap-2">
        <Input icon={TicketPercent} placeholder="Coupon code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="h-10 uppercase" />
        {couponCode ? (
          <Button variant="subtle" size="sm" className="h-10" onClick={() => { setCoupon(null); setCode('') }}>Remove</Button>
        ) : (
          <Button variant="outline" size="sm" className="h-10" onClick={() => apply()}>Apply</Button>
        )}
      </div>
      {!couponCode && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestions.map((o) => (
            <button key={o.id} onClick={() => apply(o.code)} className="rounded-lg border border-dashed border-gold-400/40 px-2 py-1 text-[11px] font-bold tracking-wider text-gold-300 hover:bg-gold-400/10">
              {o.code}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
