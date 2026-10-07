import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import { Search, Send, Receipt as ReceiptIcon, Trash2, Printer, MessageCircle, Banknote, Smartphone, CreditCard, BedDouble, Utensils, ShoppingBag, ChefHat, Percent, Check } from 'lucide-react'
import { Button, Input, Select, QuantityStepper, Modal, Field, SmartImage, Badge } from '@/core/ui'
import { cn } from '@/core/lib/cn'
import { img } from '@/core/lib/image'
import { formatMoney } from '@/core/lib/format'
import { useDocumentTitle } from '@/core/hooks'
import { APP_CONFIG, PAYMENT_METHODS } from '@/core/config/app.config'
import { useCatalogStore, CATEGORIES, VegMark } from '@/modules/catalog'
import { useOrdersStore, computeTotals, placeOrder, settleOrders, OrderStatusBadge } from '@/modules/ordering'
import { useTablesStore } from '@/modules/tables'
import { useStaffStore } from '@/modules/staff'
import { usePmsStore } from '@/modules/hotel-pms'
import { usePermission } from '@/modules/auth'
import { Receipt } from '../components/Receipt'

const mergeLines = (lines) => {
  const map = new Map()
  lines.forEach((l) => map.set(l.id, map.has(l.id) ? { ...map.get(l.id), qty: map.get(l.id).qty + l.qty } : { ...l }))
  return [...map.values()]
}

export default function PosPage() {
  useDocumentTitle('POS & Billing')
  const can = usePermission()
  const [params] = useSearchParams()
  const items = useCatalogStore((s) => s.items)
  const orders = useOrdersStore((s) => s.orders)
  const tables = useTablesStore((s) => s.tables)
  const staff = useStaffStore((s) => s.staff)
  const waiters = staff.filter((s) => s.role === 'waiter')

  const [mode, setMode] = useState('table')
  const [tableId, setTableId] = useState(params.get('table') ?? 'T05')
  const [waiter, setWaiter] = useState('Ravi Teja')
  const [category, setCategory] = useState('all')
  const [q, setQ] = useState('')
  const [ticket, setTicket] = useState([])
  const [discount, setDiscount] = useState(0)
  const [bill, setBill] = useState(null)

  const menu = useMemo(() => items.filter((i) => i.available && (category === 'all' || i.category === category) && i.name.toLowerCase().includes(q.toLowerCase())), [items, category, q])
  const running = useMemo(() => (mode === 'table' ? orders.filter((o) => o.tableId === tableId && o.payment.status === 'pending' && o.status !== 'cancelled') : []), [orders, mode, tableId])
  const billLines = mergeLines([...running.flatMap((o) => o.items), ...ticket])
  const totals = computeTotals(billLines, { discount: Number(discount) || 0, rounding: 'paise' })

  const add = (dish) =>
    setTicket((t) => (t.some((l) => l.id === dish.id) ? t.map((l) => (l.id === dish.id ? { ...l, qty: l.qty + 1 } : l)) : [...t, { id: dish.id, name: dish.name, price: dish.price, qty: 1, station: dish.station, category: dish.category, veg: dish.veg, image: dish.image }]))
  const setQty = (id, qty) => setTicket((t) => (qty <= 0 ? t.filter((l) => l.id !== id) : t.map((l) => (l.id === id ? { ...l, qty } : l))))

  const sendKot = () => {
    if (!ticket.length) return null
    const order = placeOrder({
      type: mode === 'table' ? 'dine-in' : 'takeaway',
      lines: ticket,
      tableId: mode === 'table' ? tableId : undefined,
      waiter: mode === 'table' ? waiter : undefined,
      customer: { name: mode === 'table' ? tables.find((t) => t.id === tableId)?.guest ?? 'Walk-in Guest' : 'Counter Takeaway', mobile: '', email: '' },
      paymentMethod: PAYMENT_METHODS.CASH,
      pickupTime: 'ASAP – 20 minutes',
      source: 'pos',
      rounding: 'paise',
    })
    setTicket([])
    toast.success(`KOT sent · #${order.code}`, { description: `${order.items.length} items to the kitchen display` })
    return order
  }

  const generateBill = () => {
    const fresh = sendKot()
    const ids = [...running.map((o) => o.id), ...(fresh ? [fresh.id] : [])]
    if (!ids.length) return toast.error('Add items to create a bill')
    const lines = mergeLines([...running.flatMap((o) => o.items), ...(fresh?.items ?? [])])
    const t = computeTotals(lines, { discount: Number(discount) || 0, rounding: 'paise' })
    setBill({ ids, lines, totals: t, total: t.total, number: `INV-${Date.now().toString().slice(-6)}`, at: Date.now(), tableId: mode === 'table' ? tableId : null, waiter: mode === 'table' ? waiter : null })
  }

  return (
    <div className="-m-4 grid h-[calc(100dvh-4rem)] lg:-m-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      {/* Menu pane */}
      <section className="flex min-h-0 flex-col border-line lg:border-r">
        <div className="space-y-3 border-b border-line bg-surface/60 p-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-semibold">New Bill</h1>
            <Badge tone="gold">POS</Badge>
            <div className="ml-auto w-full max-w-xs"><Input icon={Search} placeholder="Search menu…" value={q} onChange={(e) => setQ(e.target.value)} className="h-10" /></div>
          </div>
          <div className="scrollbar-none flex gap-1.5 overflow-x-auto">
            {[{ id: 'all', name: 'All' }, ...CATEGORIES].map((c) => (
              <button key={c.id} onClick={() => setCategory(c.id)} className={cn('shrink-0 rounded-xl px-3.5 py-2 text-sm font-semibold transition', category === c.id ? 'bg-fg text-bg' : 'bg-surface-2 text-muted hover:text-fg')}>
                {c.name}
              </button>
            ))}
          </div>
        </div>
        <div className="scrollbar-thin grid flex-1 auto-rows-min grid-cols-2 gap-3 overflow-y-auto p-4 sm:grid-cols-3 xl:grid-cols-4">
          {menu.map((dish) => (
            <motion.button key={dish.id} layout whileTap={{ scale: 0.95 }} onClick={() => add(dish)} className="group overflow-hidden rounded-2xl border border-line bg-surface text-left transition hover:border-gold-400/60 hover:shadow-lg">
              <SmartImage src={img(dish.image, { w: 300, h: 200 })} alt="" className="aspect-[3/2]" imgClassName="transition-transform duration-500 group-hover:scale-105" />
              <div className="p-3">
                <div className="flex items-start gap-1.5"><VegMark veg={dish.veg} className="mt-0.5" /><span className="line-clamp-2 text-sm font-semibold leading-tight">{dish.name}</span></div>
                <div className="mt-1.5 font-display text-lg font-semibold text-gold-600 dark:text-gold-300">{formatMoney(dish.price)}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Ticket pane */}
      <aside className="flex min-h-0 flex-col bg-surface">
        <div className="space-y-3 border-b border-line p-4">
          <div className="grid grid-cols-2 gap-2">
            {[['table', 'Dine-In', Utensils], ['takeaway', 'Takeaway', ShoppingBag]].map(([k, label, Icon]) => (
              <button key={k} onClick={() => setMode(k)} className={cn('flex items-center justify-center gap-2 rounded-xl border py-2 text-sm font-semibold transition', mode === k ? 'border-gold-400 bg-gold-400/15 text-gold-700 dark:text-gold-200' : 'border-line text-muted')}>
                <Icon className="size-4" />{label}
              </button>
            ))}
          </div>
          {mode === 'table' && (
            <div className="grid grid-cols-2 gap-2">
              <Field label="Table">
                <Select value={tableId} onChange={(e) => setTableId(e.target.value)} className="h-10">
                  {tables.map((t) => <option key={t.id} value={t.id}>{t.id} · {t.status}</option>)}
                </Select>
              </Field>
              <Field label="Waiter">
                <Select value={waiter} onChange={(e) => setWaiter(e.target.value)} className="h-10">
                  {waiters.map((w) => <option key={w.id}>{w.name}</option>)}
                </Select>
              </Field>
            </div>
          )}
        </div>

        <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4">
          {running.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted"><ChefHat className="size-3.5" /> Sent to kitchen</div>
              <div className="space-y-2">
                {running.map((o) => (
                  <div key={o.id} className="rounded-xl border border-line bg-surface-2/50 p-3">
                    <div className="mb-1 flex items-center justify-between text-xs"><span className="font-semibold">#{o.code}</span><OrderStatusBadge status={o.status} /></div>
                    {o.items.map((l) => (
                      <div key={l.id} className="grid grid-cols-[minmax(0,1fr)_28px_70px] text-sm"><span className="truncate">{l.name}</span><span className="text-right text-muted">{l.qty}</span><span className="text-right tabular-nums">{formatMoney(l.price * l.qty)}</span></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="mb-2 grid grid-cols-[minmax(0,1fr)_auto_70px] text-[11px] font-semibold uppercase tracking-[0.14em] text-muted"><span>New items</span><span>Qty</span><span className="text-right">Total</span></div>
            <AnimatePresence initial={false}>
              {ticket.map((l) => (
                <motion.div key={l.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-[minmax(0,1fr)_auto_70px] items-center gap-2 border-b border-line py-2">
                  <div className="min-w-0"><div className="truncate text-sm font-semibold">{l.name}</div><div className="text-xs text-muted">{formatMoney(l.price)}</div></div>
                  <QuantityStepper size="sm" value={l.qty} onChange={(qty) => setQty(l.id, qty)} />
                  <span className="text-right text-sm font-semibold tabular-nums">{formatMoney(l.price * l.qty)}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {ticket.length === 0 && <div className="rounded-xl border border-dashed border-line-strong py-8 text-center text-sm text-muted">Tap dishes to add them</div>}
          </div>
        </div>

        <div className="space-y-3 border-t border-line bg-surface-2/40 p-4">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-1.5 text-muted"><Percent className="size-3.5" /> Discount (₹)</span>
            <Input type="number" min={0} value={discount} onChange={(e) => setDiscount(e.target.value)} disabled={!can('pos.discount')} className="h-9 w-28 text-right" title={can('pos.discount') ? '' : 'Requires discount permission'} />
          </div>
          <div className="space-y-1 text-sm">
            <Row label="Subtotal" value={formatMoney(totals.subtotal, { precise: true })} />
            {totals.discount > 0 && <Row label="Discount" value={`− ${formatMoney(totals.discount, { precise: true })}`} />}
            <Row label="GST / Taxes (18%)" value={formatMoney(totals.tax, { precise: true })} />
          </div>
          <div className="flex items-end justify-between border-t border-dashed border-line-strong pt-3">
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Grand Total</span>
            <motion.span key={totals.total} initial={{ scale: 1.08 }} animate={{ scale: 1 }} className="font-display text-3xl font-semibold tabular-nums">{formatMoney(totals.total, { precise: true })}</motion.span>
          </div>
          <div className="grid grid-cols-[auto_1fr_1fr] gap-2">
            <Button variant="subtle" size="icon" onClick={() => setTicket([])} aria-label="Clear ticket"><Trash2 className="size-4" /></Button>
            <Button variant="outline" icon={Send} onClick={sendKot} disabled={!ticket.length}>Send KOT</Button>
            <Button icon={ReceiptIcon} onClick={generateBill} disabled={!can('pos.bill') || (!ticket.length && !running.length)}>Generate Bill</Button>
          </div>
        </div>
      </aside>

      <BillModal key={bill?.number ?? 'none'} bill={bill} onClose={() => setBill(null)} onSettled={() => { setBill(null); setDiscount(0) }} />
    </div>
  )
}

const Row = ({ label, value }) => (
  <div className="flex justify-between"><span className="text-muted">{label}</span><span className="font-semibold tabular-nums">{value}</span></div>
)

const METHODS = [
  { id: PAYMENT_METHODS.CASH, label: 'Cash', icon: Banknote },
  { id: PAYMENT_METHODS.UPI, label: 'UPI', icon: Smartphone },
  { id: PAYMENT_METHODS.CARD, label: 'Card', icon: CreditCard },
  { id: PAYMENT_METHODS.ROOM_CHARGE, label: 'Room Charge', icon: BedDouble },
]

function BillModal({ bill, onClose, onSettled }) {
  const can = usePermission()
  const guests = usePmsStore((s) => s.guests)
  const [method, setMethod] = useState(PAYMENT_METHODS.CASH)
  const [room, setRoom] = useState('504')
  const [phone, setPhone] = useState('')
  const [tendered, setTendered] = useState('')

  if (!bill) return <Modal open={false} onClose={onClose} />
  const guest = guests.find((g) => g.room === room)
  const change = Number(tendered) - bill.total

  const settle = () => {
    if (!can('pos.payment')) return toast.error('You need the “Receive payment” permission')
    settleOrders(bill.ids, { method, discount: bill.totals.discount, bill: { ...bill, method }, room: method === PAYMENT_METHODS.ROOM_CHARGE ? { number: room, guestName: guest?.name } : undefined })
    if (bill.tableId) useTablesStore.getState().release(bill.tableId)
    toast.success(method === PAYMENT_METHODS.ROOM_CHARGE ? `Charged to Room ${room}` : `Payment received · ${formatMoney(bill.total, { precise: true })}`, { description: bill.tableId ? `${bill.tableId} released for cleaning` : bill.number })
    onSettled()
  }

  const whatsapp = () => {
    const text = [`*${APP_CONFIG.brand.name}* — Bill ${bill.number}`, ...bill.lines.map((l) => `${l.name} x${l.qty} — ₹${l.price * l.qty}`), `Subtotal: ₹${bill.totals.subtotal}`, bill.totals.discount ? `Discount: -₹${bill.totals.discount}` : null, `GST: ₹${bill.totals.tax.toFixed(2)}`, `*Grand Total: ₹${bill.total.toFixed(2)}*`, 'Thank you for dining with us!'].filter(Boolean).join('\n')
    window.open(`https://wa.me/${phone.replace(/\D/g, '') ? `91${phone.replace(/\D/g, '').slice(-10)}` : ''}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  return (
    <Modal open={!!bill} onClose={onClose} title="Bill & Payment" description={`${bill.number}${bill.tableId ? ` · Table ${bill.tableId}` : ''}`} size="lg"
      footer={
        <>
          <Button variant="outline" icon={Printer} disabled={!can('pos.print')} onClick={() => window.print()}>Print Bill</Button>
          <Button variant="outline" icon={MessageCircle} onClick={whatsapp}>Send WhatsApp</Button>
          <Button icon={Check} onClick={settle}>Settle {formatMoney(bill.total, { precise: true })}</Button>
        </>
      }>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_1fr]">
        <div className="rounded-2xl bg-surface-3/60 p-3"><Receipt bill={{ ...bill, method }} /></div>
        <div className="space-y-5">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Payment</div>
            <div className="grid grid-cols-2 gap-2">
              {METHODS.map((m) => (
                <button key={m.id} onClick={() => setMethod(m.id)} className={cn('flex items-center gap-2 rounded-xl border p-3 text-sm font-semibold transition', method === m.id ? 'border-gold-400 bg-gold-400/15' : 'border-line hover:border-line-strong')}>
                  <m.icon className="size-4.5 text-gold-500" />{m.label}
                </button>
              ))}
            </div>
          </div>
          {method === PAYMENT_METHODS.CASH && (
            <Field label="Cash tendered" hint={Number(tendered) >= bill.total ? `Change due: ${formatMoney(change, { precise: true })}` : ' '}>
              <Input type="number" value={tendered} onChange={(e) => setTendered(e.target.value)} placeholder={String(Math.ceil(bill.total / 100) * 100)} />
            </Field>
          )}
          {method === PAYMENT_METHODS.UPI && (
            <div className="flex items-center gap-4 rounded-2xl border border-line p-4">
              <div className="grid size-24 shrink-0 grid-cols-6 gap-0.5 rounded-lg bg-white p-2">{Array.from({ length: 36 }, (_, i) => <span key={i} className={(i * 7 + 3) % 5 < 2 ? 'bg-neutral-900' : 'bg-white'} />)}</div>
              <div className="text-sm"><div className="font-semibold">Scan to pay</div><div className="text-muted">dragonpearl@hdfcbank</div></div>
            </div>
          )}
          {method === PAYMENT_METHODS.ROOM_CHARGE && (
            <div className="space-y-2">
              <Field label="In-house guest">
                <Select value={room} onChange={(e) => setRoom(e.target.value)}>
                  {guests.map((g) => <option key={g.id} value={g.room}>Room {g.room} · {g.name}</option>)}
                </Select>
              </Field>
              {guest && <p className="text-xs text-muted">Will post to {guest.title} {guest.name}'s folio via hotel PMS.</p>}
            </div>
          )}
          <Field label="Customer WhatsApp (optional)"><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98765 43210" /></Field>
        </div>
      </div>
    </Modal>
  )
}
