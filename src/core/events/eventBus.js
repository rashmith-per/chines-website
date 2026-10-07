/**
 * In-process domain event bus — the only sanctioned way for modules to react to
 * each other without importing one another (keeps the monolith loosely coupled).
 *
 *   publish(EVENTS.ORDER_PLACED, order)
 *   const off = subscribe(EVENTS.ORDER_PLACED, handler)
 */
const listeners = new Map()

export function subscribe(event, handler) {
  if (!listeners.has(event)) listeners.set(event, new Set())
  listeners.get(event).add(handler)
  return () => listeners.get(event)?.delete(handler)
}

export function publish(event, payload) {
  const handlers = listeners.get(event)
  if (import.meta.env.DEV) console.debug(`%c[event] ${event}`, 'color:#e0b062', payload)
  handlers?.forEach((h) => {
    try {
      h(payload)
    } catch (err) {
      console.error(`[event] handler for "${event}" failed`, err)
    }
  })
}

/** Catalogue of every domain event in the system. */
export const EVENTS = Object.freeze({
  ORDER_PLACED: 'order.placed',
  ORDER_STATUS_CHANGED: 'order.statusChanged',
  ORDER_CANCELLED: 'order.cancelled',
  PAYMENT_RECEIVED: 'payment.received',
  BILL_GENERATED: 'pos.billGenerated',
  ROOM_CHARGE_REQUESTED: 'pms.roomChargeRequested',
  ROOM_CHARGE_POSTED: 'pms.roomChargePosted',
  RESERVATION_CREATED: 'reservation.created',
  RESERVATION_UPDATED: 'reservation.updated',
  RESERVATION_CANCELLED: 'reservation.cancelled',
  INVENTORY_LOW: 'inventory.low',
  LOYALTY_POINTS_EARNED: 'loyalty.pointsEarned',
  NOTIFY: 'notify',
})
