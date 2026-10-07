import { createPersistedStore } from '@/core/store/createStore'
import { uid } from '@/core/lib/id'
import { APP_CONFIG } from '@/core/config/app.config'
import { OFFERS, MEMBERS } from '../data/offers.data'

export const useOffersStore = createPersistedStore('offers', (set, get) => ({
  offers: OFFERS,

  findByCode: (code) => {
    const c = String(code || '').trim().toUpperCase()
    return get().offers.find((o) => o.active && o.code === c) ?? null
  },

  toggleActive: (id) => set((s) => ({ offers: s.offers.map((o) => (o.id === id ? { ...o, active: !o.active } : o)) })),

  upsertOffer: (data) =>
    set((s) =>
      data.id && s.offers.some((o) => o.id === data.id)
        ? { offers: s.offers.map((o) => (o.id === data.id ? { ...o, ...data } : o)) }
        : { offers: [{ ...data, id: uid('offer'), active: true, redemptions: 0 }, ...s.offers] },
    ),

  removeOffer: (id) => set((s) => ({ offers: s.offers.filter((o) => o.id !== id) })),

  recordRedemption: (code) =>
    set((s) => ({ offers: s.offers.map((o) => (o.code === code ? { ...o, redemptions: o.redemptions + 1 } : o)) })),
}))

/** The signed-in customer's loyalty wallet + programme members (CRM view). */
export const useLoyaltyStore = createPersistedStore('loyalty', (set, get) => ({
  points: 1250,
  history: [
    { id: 'h1', at: Date.now() - 3 * 86_400_000, label: 'Order DP10198', points: 142 },
    { id: 'h2', at: Date.now() - 9 * 86_400_000, label: 'Redeemed — Jasmine Pearl Tea', points: -300 },
    { id: 'h3', at: Date.now() - 14 * 86_400_000, label: 'Birthday bonus', points: 250 },
    { id: 'h4', at: Date.now() - 21 * 86_400_000, label: 'Order DP10077', points: 188 },
  ],
  members: MEMBERS,

  rupeeValue: (points = get().points) => Math.floor(points * APP_CONFIG.loyalty.rupeesPerPoint),

  earn: (amount, label) => {
    const pts = Math.floor(amount * APP_CONFIG.loyalty.pointsPerRupee)
    if (pts <= 0) return 0
    set((s) => ({ points: s.points + pts, history: [{ id: uid('h'), at: Date.now(), label, points: pts }, ...s.history] }))
    return pts
  },

  redeem: (points, label) => {
    if (points > get().points) return false
    set((s) => ({ points: s.points - points, history: [{ id: uid('h'), at: Date.now(), label, points: -points }, ...s.history] }))
    return true
  },

  adjustMember: (id, delta) => set((s) => ({ members: s.members.map((m) => (m.id === id ? { ...m, points: Math.max(0, m.points + delta) } : m)) })),
}))
