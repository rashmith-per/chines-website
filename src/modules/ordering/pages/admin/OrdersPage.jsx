import { useMemo, useState } from 'react'
import { Search, ChevronRight, XCircle, Printer, Clock, MapPin, BedDouble, Utensils, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader, Card, DataTable, Segmented, Input, Select, Button, Drawer, Badge } from '@/core/ui'
import { formatMoney, formatTime, timeAgo } from '@/core/lib/format'
import { PAYMENT_META } from '@/core/config/app.config'
import { useDocumentTitle } from '@/core/hooks'
import { Can } from '@/modules/auth'
import { useOrdersStore, STATUS_META, nextStatus } from '../../store/orders.store'
import { advanceOrder, cancelOrder } from '../../services/order.service'
import { OrderTypeBadge, OrderStatusBadge, OrderStatusStepper, TotalsBlock } from '../../components/OrderBits'

const TYPES = [
  { value: 'all', label: 'All' },
  { value: 'dine-in', label: 'Dine-In' },
  { value: 'takeaway', label: 'Takeaway' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'room-service', label: 'Room Service' },
]

export const PaymentBadge = ({ payment }) => (
  <Badge tone={payment.status === 'pending' ? 'amber' : payment.status === 'room-charged' ? 'violet' : 'jade'}>
    {PAYMENT_META[payment.method]?.label} · {payment.status === 'pending' ? 'Due' : payment.status === 'room-charged' ? 'Folio' : 'Paid'}
  </Badge>
)

export default function OrdersPage() {
  useDocumentTitle('Orders')
  const orders = useOrdersStore((s) => s.orders)
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('active')
  const [q, setQ] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const selected = orders.find((o) => o.id === selectedId)

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase()
    return orders.filter(
      (o) =>
        (type === 'all' || o.type === type) &&
        (status === 'all' || (status === 'active' ? !['completed', 'cancelled'].includes(o.status) : o.status === status)) &&
        (!query || o.code.toLowerCase().includes(query) || o.customer?.name?.toLowerCase().includes(query)),
    )
  }, [orders, type, status, q])

  const counts = useMemo(() => {
    const c = {}
    orders.forEach((o) => (c[o.type] = (c[o.type] ?? 0) + 1))
    return c
  }, [orders])

  const columns = [
    { key: 'code', header: 'Order', render: (o) => <div><div className="font-semibold">#{o.code}</div><div className="text-xs text-muted">{timeAgo(o.createdAt)}</div></div> },
    { key: 'customer', header: 'Customer', render: (o) => <div><div className="font-medium">{o.customer?.name}</div><div className="text-xs text-muted">{o.tableId ? `Table ${o.tableId}` : o.room ? `Room ${o.room.number}` : o.source === 'web' ? 'Website' : o.source}</div></div> },
    { key: 'type', header: 'Type', render: (o) => <OrderTypeBadge type={o.type} /> },
    { key: 'items', header: 'Items', render: (o) => <span className="text-muted">{o.items.reduce((n, l) => n + l.qty, 0)} items</span> },
    { key: 'total', header: 'Total', align: 'right', render: (o) => <span className="font-semibold tabular-nums">{formatMoney(o.pricing.total)}</span> },
    { key: 'payment', header: 'Payment', render: (o) => <PaymentBadge payment={o.payment} /> },
    { key: 'status', header: 'Status', render: (o) => <OrderStatusBadge status={o.status} /> },
    {
      key: 'act',
      header: '',
      align: 'right',
      render: (o) => {
        const next = nextStatus(o.status)
        return next && o.status !== 'cancelled' ? (
          <Can permission="orders.manage">
            <Button size="xs" variant="subtle" onClick={(e) => { e.stopPropagation(); advanceOrder(o.id, next) }}>
              {STATUS_META[next].short} <ChevronRight className="size-3" />
            </Button>
          </Can>
        ) : null
      },
    },
  ]

  return (
    <>
      <PageHeader title="Orders" cjk="訂單" subtitle="Every dine-in, takeaway, delivery and room-service order in one live feed." />
      <Card>
        <div className="flex flex-col gap-3 border-b border-line p-4 xl:flex-row xl:items-center xl:justify-between">
          <Segmented size="sm" layoutId="orders-type" value={type} onChange={setType} options={TYPES.map((t) => ({ ...t, count: t.value === 'all' ? orders.length : counts[t.value] ?? 0 }))} className="scrollbar-none max-w-full overflow-x-auto" />
          <div className="flex gap-2">
            <Select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 w-40">
              <option value="active">Active</option>
              <option value="all">All statuses</option>
              {Object.entries(STATUS_META).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </Select>
            <div className="w-56"><Input icon={Search} placeholder="Search order / guest" value={q} onChange={(e) => setQ(e.target.value)} className="h-10" /></div>
          </div>
        </div>
        <DataTable columns={columns} rows={rows.slice(0, 80)} onRowClick={(o) => setSelectedId(o.id)} />
      </Card>

      <OrderDrawer order={selected} onClose={() => setSelectedId(null)} />
    </>
  )
}

export function OrderDrawer({ order, onClose }) {
  const next = order && nextStatus(order.status)
  return (
    <Drawer open={!!order} onClose={onClose} title={order ? `#${order.code}` : ''} subtitle={order ? `${formatTime(order.createdAt)} · ${order.customer?.name}` : ''} width="max-w-lg"
      footer={order && order.status !== 'cancelled' && order.status !== 'completed' && (
        <Can permission="orders.manage">
          <div className="flex gap-2">
            <Button variant="danger" icon={XCircle} onClick={() => { cancelOrder(order.id); toast('Order cancelled') }}>Cancel</Button>
            {next && <Button className="flex-1" onClick={() => advanceOrder(order.id, next)}>Mark as {STATUS_META[next].label}</Button>}
          </div>
        </Can>
      )}
    >
      {order && (
        <div className="space-y-6 p-6">
          <div className="flex flex-wrap gap-2">
            <OrderTypeBadge type={order.type} />
            <OrderStatusBadge status={order.status} />
            <PaymentBadge payment={order.payment} />
          </div>
          <OrderStatusStepper order={order} orientation="vertical" />
          <div className="grid gap-3 rounded-2xl border border-line bg-surface-2/40 p-4 text-sm">
            {order.tableId && <Info icon={Utensils} text={`Table ${order.tableId} · ${order.waiter ?? 'Unassigned'}`} />}
            {order.room && <Info icon={BedDouble} text={`Room ${order.room.number} · ${order.room.guestName}`} />}
            {order.delivery && <Info icon={MapPin} text={`${order.delivery.address}, ${order.delivery.pincode}`} />}
            {order.pickupTime && <Info icon={ShoppingBag} text={`Pickup ${order.pickupTime}`} />}
            <Info icon={Clock} text={`Source: ${order.source}${order.couponCode ? ` · Coupon ${order.couponCode}` : ''}`} />
          </div>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Items</div>
            <div className="divide-y divide-line rounded-2xl border border-line">
              {order.items.map((l) => (
                <div key={l.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span>{l.name} <span className="text-muted">× {l.qty}</span></span>
                  <span className="font-semibold tabular-nums">{formatMoney(l.price * l.qty)}</span>
                </div>
              ))}
            </div>
          </div>
          <TotalsBlock totals={order.pricing} />
          <Button variant="outline" icon={Printer} className="w-full" onClick={() => window.print()}>Print KOT</Button>
        </div>
      )}
    </Drawer>
  )
}

const Info = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2.5"><Icon className="size-4 text-gold-500" /><span>{text}</span></div>
)
