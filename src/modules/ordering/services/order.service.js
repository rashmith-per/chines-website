import { publish, EVENTS } from '@/core/events/eventBus'
import { ORDER_TYPES, PAYMENT_METHODS } from '@/core/config/app.config'
import { sequenceCode } from '@/core/lib/id'
import { useOrdersStore } from '../store/orders.store'
import { computeTotals } from '../lib/pricing'

/**
 * Application service for the order lifecycle. UI never mutates orders directly —
 * it calls these use-cases, which persist state and broadcast domain events that
 * KDS, inventory, notifications, loyalty and the PMS bridge react to.
 */
export function placeOrder({ type, lines, customer, delivery, pickupTime, room, tableId, waiter, paymentMethod, discount = 0, couponCode, source = 'web', rounding = 'rupee', notes }) {
  const store = useOrdersStore.getState()
  const isRoom = type === ORDER_TYPES.ROOM_SERVICE
  const existing = store.orders.filter((o) => (isRoom ? o.code.startsWith('RS') : o.code.startsWith('DP'))).map((o) => o.code)
  const code = sequenceCode(isRoom ? 'RS' : 'DP', existing, isRoom ? 1000 : 10000)
  const pricing = computeTotals(lines, { type, discount, rounding })
  const now = Date.now()

  const paymentStatus =
    paymentMethod === PAYMENT_METHODS.ROOM_CHARGE
      ? 'room-charged'
      : [PAYMENT_METHODS.UPI, PAYMENT_METHODS.CARD].includes(paymentMethod) && source !== 'pos'
        ? 'paid'
        : 'pending'

  const order = {
    id: code,
    code,
    type,
    status: 'received',
    items: lines.map((l) => ({ ...l })),
    customer: customer ?? { name: 'Walk-in Guest', mobile: '', email: '' },
    delivery: type === ORDER_TYPES.DELIVERY ? delivery : undefined,
    pickupTime: type === ORDER_TYPES.TAKEAWAY ? pickupTime : undefined,
    room: isRoom ? room : undefined,
    tableId,
    waiter,
    notes,
    couponCode,
    payment: { method: paymentMethod, status: paymentStatus },
    pricing,
    source,
    createdAt: now,
    timeline: [{ status: 'received', at: now }],
  }

  store.addOrder(order)
  publish(EVENTS.ORDER_PLACED, order)
  if (paymentStatus === 'paid') publish(EVENTS.PAYMENT_RECEIVED, { order, amount: pricing.total, method: paymentMethod })
  if (paymentMethod === PAYMENT_METHODS.ROOM_CHARGE) {
    publish(EVENTS.ROOM_CHARGE_REQUESTED, { orderCode: code, room: room?.number, guestName: room?.guestName, amount: pricing.total, items: order.items })
  }
  return order
}

export function advanceOrder(id, status) {
  const store = useOrdersStore.getState()
  const order = store.getOrder(id)
  if (!order || order.status === status) return
  store.setStatus(id, status)
  publish(EVENTS.ORDER_STATUS_CHANGED, { order: { ...order, status }, from: order.status, to: status })
}

export function cancelOrder(id, reason = 'Cancelled by staff') {
  const store = useOrdersStore.getState()
  const order = store.getOrder(id)
  if (!order) return
  store.setStatus(id, 'cancelled')
  store.patchOrder(id, { cancelReason: reason })
  publish(EVENTS.ORDER_CANCELLED, { order, reason })
}

/** Settle one or more open dine-in orders (POS bill). */
export function settleOrders(ids, { method, discount = 0, bill, room }) {
  const store = useOrdersStore.getState()
  ids.forEach((id) => {
    store.patchOrder(id, (o) => ({
      payment: { method, status: method === PAYMENT_METHODS.ROOM_CHARGE ? 'room-charged' : 'paid' },
      status: o.status === 'cancelled' ? o.status : 'completed',
      timeline: [...o.timeline, { status: 'completed', at: Date.now() }],
    }))
  })
  publish(EVENTS.BILL_GENERATED, { ...bill, orderIds: ids, method, discount })
  if (method === PAYMENT_METHODS.ROOM_CHARGE) {
    publish(EVENTS.ROOM_CHARGE_REQUESTED, { orderCode: bill.number, room: room?.number, guestName: room?.guestName, amount: bill.total, items: bill.lines })
  } else {
    publish(EVENTS.PAYMENT_RECEIVED, { amount: bill.total, method, bill })
  }
}
