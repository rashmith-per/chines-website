import { createPersistedStore } from '@/core/store/createStore'
import { uid } from '@/core/lib/id'
import { MENU_ITEMS } from '../data/menu.data'

export const useCatalogStore = createPersistedStore('catalog', (set, get) => ({
  items: MENU_ITEMS,

  getById: (id) => get().items.find((i) => i.id === id),

  toggleAvailability: (id) =>
    set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, available: !i.available } : i)) })),

  upsertItem: (data) =>
    set((s) => {
      if (data.id && s.items.some((i) => i.id === data.id)) {
        return { items: s.items.map((i) => (i.id === data.id ? { ...i, ...data } : i)) }
      }
      return { items: [{ ...data, id: uid('dish'), available: true, tags: data.tags ?? [], rating: 4.5 }, ...s.items] }
    }),

  removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
}))

/** Selector helpers */
export const selectAvailable = (s) => s.items.filter((i) => i.available)
