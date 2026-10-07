import { createPersistedStore } from '@/core/store/createStore'
import { seedOrders } from '../data/orders.seed'

export const ORDER_FLOW = ['received', 'confirmed', 'preparing', 'ready', 'completed']

export const STATUS_META = {
  received: { label: 'Order Received', short: 'New', tone: 'blue' },
  confirmed: { label: 'Confirmed', short: 'Accepted', tone: 'violet' },
  preparing: { label: 'Preparing', short: 'Cooking', tone: 'amber' },
  ready: { label: 'Ready', short: 'Ready', tone: 'jade' },
  completed: { label: 'Completed', short: 'Done', tone: 'neutral' },
  cancelled: { label: 'Cancelled', short: 'Cancelled', tone: 'red' },
}

export const useOrdersStore = createPersistedStore(
  'orders',
  (set, get) => ({
    orders: seedOrders(),

    getOrder: (id) => get().orders.find((o) => o.id === id),

    addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),

    patchOrder: (id, patch) =>
      set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, ...(typeof patch === 'function' ? patch(o) : patch) } : o)) })),

    setStatus: (id, status) =>
      set((s) => ({
        orders: s.orders.map((o) =>
          o.id === id ? { ...o, status, timeline: [...o.timeline.filter((t) => t.status !== status), { status, at: Date.now() }] } : o,
        ),
      })),
  }),
  { version: 2 },
)

/** Orders currently in the kitchen pipeline. */
export const selectActive = (s) => s.orders.filter((o) => !['completed', 'cancelled'].includes(o.status))

export const nextStatus = (status) => ORDER_FLOW[ORDER_FLOW.indexOf(status) + 1]
