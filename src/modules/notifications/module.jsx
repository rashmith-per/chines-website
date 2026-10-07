import { lazy } from 'react'
import { toast } from 'sonner'
import { BellRing } from 'lucide-react'
import { defineModule } from '@/core/module/defineModule'
import { subscribe, EVENTS } from '@/core/events/eventBus'
import { formatMoney, to12h, formatDate } from '@/core/lib/format'
import { ORDER_TYPE_META, PAYMENT_META } from '@/core/config/app.config'
import { useNotificationsStore } from './store/notifications.store'

const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))

const first = (name = '') => name.split(' ')[0]

export default defineModule({
  id: 'notifications',
  name: 'Notifications',
  adminRoutes: [{ path: 'notifications', element: <NotificationsPage />, permission: 'notifications.manage' }],
  adminNav: [{ path: '/admin/notifications', label: 'Notifications', icon: BellRing, group: 'Business', order: 70, permission: 'notifications.manage' }],
  register() {
    const push = (n) => useNotificationsStore.getState().push(n)
    const isAdmin = () => window.location.pathname.startsWith('/admin')

    const offs = [
      subscribe(EVENTS.ORDER_PLACED, (o) => {
        push({ audience: 'restaurant', kind: 'new-order', title: 'New order', body: `New ${ORDER_TYPE_META[o.type].label.toLowerCase()} order #${o.code} · ${formatMoney(o.pricing.total)}${o.tableId ? ` · Table ${o.tableId}` : o.room ? ` · Room ${o.room.number}` : ''}` })
        if (o.source !== 'pos') push({ audience: 'customer', kind: 'order-confirmation', title: 'Order confirmation', body: `Thank you ${first(o.customer?.name)}! Order #${o.code} (${formatMoney(o.pricing.total)}) is confirmed.` })
      }),
      subscribe(EVENTS.ORDER_STATUS_CHANGED, ({ order, to }) => {
        if (to === 'ready') {
          const kind = order.type === 'delivery' ? 'delivery-update' : 'order-ready'
          const body = order.type === 'delivery' ? `Order #${order.code} is out for delivery. ETA 15 min.` : `Good news ${first(order.customer?.name)} — order #${order.code} is ready! 🥢`
          push({ audience: 'customer', kind, title: kind === 'order-ready' ? 'Order ready' : 'Delivery update', body })
          if (!isAdmin() && order.source !== 'pos') toast.success(kind === 'order-ready' ? 'Your order is ready!' : 'Out for delivery!', { description: `#${order.code}` })
        }
      }),
      subscribe(EVENTS.PAYMENT_RECEIVED, ({ amount, method, order }) => {
        push({ audience: 'restaurant', kind: 'payment-received', title: 'Payment received', body: `${formatMoney(amount, { precise: true })} received via ${PAYMENT_META[method]?.label}` })
        if (order) push({ audience: 'customer', kind: 'payment-receipt', title: 'Payment receipt', body: `Payment of ${formatMoney(amount)} received for #${order.code}.` })
      }),
      subscribe(EVENTS.ROOM_CHARGE_POSTED, (r) => {
        push(r.ok
          ? { audience: 'restaurant', kind: 'payment-received', title: 'Room charge posted', body: `${formatMoney(r.amount, { precise: true })} posted to Room ${r.room} folio (${r.orderCode})` }
          : { audience: 'restaurant', kind: 'cancellation', title: 'Room charge failed', body: `${r.orderCode}: ${r.error}` })
      }),
      subscribe(EVENTS.ORDER_CANCELLED, ({ order, reason }) => push({ audience: 'restaurant', kind: 'cancellation', title: 'Cancellation', body: `Order #${order.code} cancelled — ${reason}` })),
      subscribe(EVENTS.RESERVATION_CREATED, (r) => {
        const when = `${formatDate(r.date, { year: undefined })} ${to12h(r.time)}`
        push({ audience: 'restaurant', kind: 'new-reservation', title: 'New reservation', body: `${r.name} booked ${r.guests} guests for ${when}${r.tableId ? ` · ${r.tableId}` : ''}` })
        push({ audience: 'customer', kind: 'booking-confirmation', title: 'Booking confirmation', body: `Hi ${first(r.name)}, your table for ${r.guests} is confirmed for ${when}. Booking ${r.code}.` })
      }),
      subscribe(EVENTS.RESERVATION_CANCELLED, (r) => push({ audience: 'restaurant', kind: 'cancellation', title: 'Cancellation', body: `Reservation ${r.code} (${r.name}) cancelled` })),
      subscribe(EVENTS.INVENTORY_LOW, (item) => {
        push({ audience: 'restaurant', kind: 'low-inventory', title: 'Low inventory', body: `${item.name} below minimum (${item.stock} ${item.unit})` })
        if (isAdmin()) toast.warning(`Low stock: ${item.name}`, { description: `${item.stock} ${item.unit} left · minimum ${item.min}` })
      }),
    ]
    return () => offs.forEach((off) => off())
  },
})
