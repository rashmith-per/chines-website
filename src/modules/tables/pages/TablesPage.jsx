import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Users, UserRound, Receipt, CalendarClock, ChefHat, Armchair, Sparkles, MonitorSmartphone, DoorOpen } from 'lucide-react'
import { PageHeader, Card, Button, Modal, Field, Input, Select, Badge, Avatar } from '@/core/ui'
import { formatMoney, to12h, todayISO, elapsed } from '@/core/lib/format'
import { useDocumentTitle, useNow } from '@/core/hooks'
import { useOrdersStore, computeTotals, OrderStatusBadge } from '@/modules/ordering'
import { useReservationsStore } from '@/modules/reservations'
import { useStaffStore } from '@/modules/staff'
import { useTablesStore, TABLE_STATUS } from '../store/tables.store'
import { FloorPlan, FloorLegend } from '../components/FloorPlan'

export default function TablesPage() {
  useDocumentTitle('Table Management')
  const tables = useTablesStore((s) => s.tables)
  const [selectedId, setSelectedId] = useState('T05')
  const selected = tables.find((t) => t.id === selectedId)
  const counts = useMemo(() => Object.fromEntries(Object.keys(TABLE_STATUS).map((k) => [k, tables.filter((t) => t.status === k).length])), [tables])
  const occupancy = Math.round((counts.occupied / tables.length) * 100)

  return (
    <>
      <PageHeader title="Restaurant Floor" cjk="桌位" subtitle="Live table status — click any table for its guest, order, bill, reservation and waiter." />
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
        {Object.entries(TABLE_STATUS).map(([k, v]) => (
          <Card key={k} className="flex items-center justify-between p-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{v.label}</div>
              <div className="mt-1 font-display text-3xl font-semibold">{counts[k]}</div>
            </div>
            <Badge tone={v.tone} dot> </Badge>
          </Card>
        ))}
        <Card className="col-span-2 p-4 md:col-span-1">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Occupancy</div>
          <div className="mt-1 font-display text-3xl font-semibold">{occupancy}%</div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-3"><motion.div className="h-full bg-gradient-to-r from-gold-300 to-lacquer-500" initial={{ width: 0 }} animate={{ width: `${occupancy}%` }} /></div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card className="p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold">Floor plan</h3>
            <FloorLegend />
          </div>
          <FloorPlan tables={tables} selectedId={selectedId} onSelect={(t) => setSelectedId(t.id)} />
        </Card>
        <AnimatePresence mode="wait">{selected && <TableDetail key={selected.id} table={selected} />}</AnimatePresence>
      </div>
    </>
  )
}

function TableDetail({ table }) {
  const navigate = useNavigate()
  const now = useNow(10000)
  const orders = useOrdersStore((s) => s.orders)
  const reservations = useReservationsStore((s) => s.reservations)
  const { seat, release, markAvailable } = useTablesStore()
  const [seatOpen, setSeatOpen] = useState(false)

  const open = orders.filter((o) => o.tableId === table.id && o.payment.status === 'pending' && o.status !== 'cancelled')
  const lines = open.flatMap((o) => o.items)
  const bill = computeTotals(lines, { rounding: 'paise' })
  const reservation = reservations
    .filter((r) => r.tableId === table.id && r.date === todayISO() && ['confirmed', 'pending'].includes(r.status))
    .sort((a, b) => a.time.localeCompare(b.time))[0]
  const meta = TABLE_STATUS[table.status]

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
      <Card className="sticky top-24 overflow-hidden">
        <div className="relative border-b border-line bg-gradient-to-br from-gold-400/10 via-transparent to-lacquer-500/10 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Table</div>
              <div className="font-display text-5xl font-semibold">{table.id}</div>
            </div>
            <Badge tone={meta.tone} dot>{meta.label}</Badge>
          </div>
          <div className="mt-3 flex gap-4 text-sm text-muted">
            <span className="flex items-center gap-1.5"><Users className="size-4" /> {table.capacity} seats</span>
            <span>{table.zone}</span>
            {table.seatedAt && <span>⏱ {elapsed(table.seatedAt, now)}</span>}
          </div>
        </div>
        <div className="space-y-4 p-5 text-sm">
          <Row icon={UserRound} label="Current customer" value={table.status === 'occupied' ? `${table.guest}${table.covers ? ` · ${table.covers} covers` : ''}` : '—'} />
          <Row icon={ChefHat} label="Waiter" value={table.waiter ? <span className="flex items-center gap-2"><Avatar name={table.waiter} size="sm" />{table.waiter}</span> : '—'} />
          <Row icon={CalendarClock} label="Reservation" value={reservation ? `${to12h(reservation.time)} · ${reservation.name} (${reservation.guests})` : 'None today'} />
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted"><Receipt className="size-3.5" /> Order</div>
            {open.length === 0 ? (
              <div className="rounded-xl border border-dashed border-line-strong p-4 text-center text-muted">No open orders</div>
            ) : (
              <div className="space-y-2">
                {open.map((o) => (
                  <div key={o.id} className="rounded-xl border border-line bg-surface-2/40 p-3">
                    <div className="mb-1.5 flex items-center justify-between"><span className="font-semibold">#{o.code}</span><OrderStatusBadge status={o.status} /></div>
                    {o.items.map((l) => (
                      <div key={l.id} className="flex justify-between text-xs text-muted"><span>{l.name} × {l.qty}</span><span>{formatMoney(l.price * l.qty)}</span></div>
                    ))}
                  </div>
                ))}
                <div className="flex items-center justify-between rounded-xl bg-gold-400/10 px-3 py-2.5">
                  <span className="font-semibold">Bill (incl. GST)</span>
                  <span className="font-display text-xl font-semibold text-gold-600 dark:text-gold-300">{formatMoney(bill.total)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 border-t border-line p-4">
          {table.status === 'occupied' ? (
            <>
              <Button icon={MonitorSmartphone} onClick={() => navigate(`/admin/pos?table=${table.id}`)}>Open in POS</Button>
              <Button variant="subtle" icon={DoorOpen} onClick={() => { release(table.id); toast('Table released for cleaning') }}>Release</Button>
            </>
          ) : table.status === 'cleaning' ? (
            <Button variant="success" className="col-span-2" icon={Sparkles} onClick={() => { markAvailable(table.id); toast.success(`${table.id} is ready for guests`) }}>Mark clean & available</Button>
          ) : (
            <>
              <Button icon={Armchair} onClick={() => setSeatOpen(true)}>Seat guests</Button>
              {table.status === 'reserved' ? (
                <Button variant="subtle" onClick={() => markAvailable(table.id)}>Clear hold</Button>
              ) : (
                <Button variant="subtle" onClick={() => navigate(`/admin/pos?table=${table.id}`)}>New order</Button>
              )}
            </>
          )}
        </div>
      </Card>
      <SeatModal open={seatOpen} onClose={() => setSeatOpen(false)} table={table} onSeat={(d) => { seat(table.id, d); toast.success(`Guests seated at ${table.id}`); setSeatOpen(false) }} defaultGuest={reservation?.name} />
    </motion.div>
  )
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-muted"><Icon className="size-4" />{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  )
}

function SeatModal({ open, onClose, table, onSeat, defaultGuest }) {
  const staff = useStaffStore((s) => s.staff)
  const waiters = staff.filter((s) => s.role === 'waiter')
  const [guest, setGuest] = useState(defaultGuest ?? '')
  const [covers, setCovers] = useState(Math.min(2, table.capacity))
  const [waiter, setWaiter] = useState(waiters[0]?.name ?? '')
  return (
    <Modal open={open} onClose={onClose} title={`Seat guests at ${table.id}`} size="sm"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={() => onSeat({ guest: guest || 'Walk-in', covers: Number(covers), waiter })}>Seat</Button></>}>
      <div className="space-y-4">
        <Field label="Guest name"><Input value={guest} onChange={(e) => setGuest(e.target.value)} placeholder="Walk-in" /></Field>
        <Field label={`Covers (max ${table.capacity})`}><Input type="number" min={1} max={table.capacity} value={covers} onChange={(e) => setCovers(e.target.value)} /></Field>
        <Field label="Waiter"><Select value={waiter} onChange={(e) => setWaiter(e.target.value)}>{waiters.map((w) => <option key={w.id}>{w.name}</option>)}</Select></Field>
      </div>
    </Modal>
  )
}
