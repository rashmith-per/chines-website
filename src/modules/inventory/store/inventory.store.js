import { createPersistedStore } from '@/core/store/createStore'
import { round2 } from '@/core/lib/format'
import { uid } from '@/core/lib/id'
import { INVENTORY } from '../data/inventory.data'

export const stockStatus = (i) => (i.stock <= 0 ? 'out' : i.stock < i.min ? 'low' : 'ok')

export const useInventoryStore = createPersistedStore('inventory', (set, get) => ({
  items: INVENTORY,
  movements: [],

  /** Apply deltas [[id, qty]] (negative = consumption). Returns items that just crossed below minimum. */
  apply: (deltas, reason) => {
    const crossed = []
    set((s) => ({
      items: s.items.map((i) => {
        const d = deltas.filter(([id]) => id === i.id).reduce((sum, [, q]) => sum + q, 0)
        if (!d) return i
        const stock = Math.max(0, round2(i.stock + d))
        if (i.stock >= i.min && stock < i.min) crossed.push({ ...i, stock })
        return { ...i, stock }
      }),
      movements: [{ id: uid('mv'), at: Date.now(), reason, deltas }, ...s.movements].slice(0, 50),
    }))
    return crossed
  },

  restock: (id, qty) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, stock: round2(i.stock + Number(qty)), lastRestocked: Date.now() } : i)),
      movements: [{ id: uid('mv'), at: Date.now(), reason: 'Restock', deltas: [[id, Number(qty)]] }, ...s.movements].slice(0, 50),
    })),

  restockAllLow: () => {
    const low = get().items.filter((i) => stockStatus(i) !== 'ok')
    set((s) => ({ items: s.items.map((i) => (stockStatus(i) !== 'ok' ? { ...i, stock: i.max, lastRestocked: Date.now() } : i)) }))
    return low.length
  },

  upsertItem: (data) =>
    set((s) =>
      data.id && s.items.some((i) => i.id === data.id)
        ? { items: s.items.map((i) => (i.id === data.id ? { ...i, ...data } : i)) }
        : { items: [...s.items, { ...data, id: uid('inv'), lastRestocked: Date.now(), usagePerDay: 1 }] },
    ),
}))
