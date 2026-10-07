import { createPersistedStore } from '@/core/store/createStore'
import { ORDER_TYPES } from '@/core/config/app.config'

const toLine = (dish, qty = 1) => ({
  id: dish.id,
  name: dish.name,
  price: dish.price,
  image: dish.image,
  veg: dish.veg,
  station: dish.station,
  category: dish.category,
  qty,
})

export const useCartStore = createPersistedStore(
  'cart',
  (set, get) => ({
    lines: [],
    orderType: ORDER_TYPES.DELIVERY,
    delivery: { mobile: '', address: '', landmark: '', pincode: '' },
    pickupTime: 'ASAP – 20 minutes',
    tableId: '',
    room: { number: '', guestName: '' },
    couponCode: null,
    customer: { name: 'Ananya Rao', mobile: '98765 43210', email: 'ananya.rao@example.com' },
    isOpen: false,

    qtyOf: (id) => get().lines.find((l) => l.id === id)?.qty ?? 0,

    add: (dish, qty = 1) =>
      set((s) => {
        const existing = s.lines.find((l) => l.id === dish.id)
        if (existing) return { lines: s.lines.map((l) => (l.id === dish.id ? { ...l, qty: l.qty + qty } : l)) }
        return { lines: [...s.lines, toLine(dish, qty)] }
      }),

    setQty: (dish, qty) =>
      set((s) => {
        if (qty <= 0) return { lines: s.lines.filter((l) => l.id !== dish.id) }
        if (!s.lines.some((l) => l.id === dish.id)) return { lines: [...s.lines, toLine(dish, qty)] }
        return { lines: s.lines.map((l) => (l.id === dish.id ? { ...l, qty } : l)) }
      }),

    remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),
    clear: () => set({ lines: [], couponCode: null }),
    setOrderType: (orderType) => set({ orderType }),
    setDelivery: (patch) => set((s) => ({ delivery: { ...s.delivery, ...patch } })),
    setPickupTime: (pickupTime) => set({ pickupTime }),
    setTable: (tableId) => set({ tableId }),
    setRoom: (patch) => set((s) => ({ room: { ...s.room, ...patch } })),
    setCoupon: (couponCode) => set({ couponCode }),
    setCustomer: (patch) => set((s) => ({ customer: { ...s.customer, ...patch } })),
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
  }),
  { partialize: ({ isOpen: _isOpen, ...rest }) => rest },
)
