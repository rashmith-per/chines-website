import { createPersistedStore } from '@/core/store/createStore'
import { uid } from '@/core/lib/id'
import { formatMoney } from '@/core/lib/format'
import { GUESTS, SYNC_LOG } from '../data/pms.data'

const normalise = (s = '') => s.toLowerCase().replace(/^(mr|mrs|ms|dr)\.?\s+/, '').trim()

export const usePmsStore = createPersistedStore('pms', (set, get) => ({
  connection: { provider: 'Opera Cloud PMS', property: 'The Grand Meridian, Hyderabad', status: 'connected', lastSync: Date.now() - 4 * 60_000 },
  settings: { autoPost: true, verifyGuestName: true, enforceCreditLimit: true },
  guests: GUESTS,
  log: SYNC_LOG,

  /** Match a guest by room number and (optionally) any part of their name. */
  findGuest: (room, name) => {
    const g = get().guests.find((x) => x.room === String(room).trim())
    if (!g) return null
    if (!name || !get().settings.verifyGuestName) return g
    const n = normalise(name)
    return normalise(g.name).split(' ').some((part) => n.includes(part)) || normalise(g.name).includes(n) ? g : null
  },

  balanceOf: (guest) => guest.charges.reduce((s, c) => s + c.amount, 0),

  addLog: (entry) => set((s) => ({ log: [{ id: uid('log'), at: Date.now(), ...entry }, ...s.log].slice(0, 60) })),

  /** Post a restaurant charge to the guest folio. Returns {ok, guest?, error?}. */
  postCharge: ({ room, guestName, amount, orderCode }) => {
    const { findGuest, settings, balanceOf, addLog } = get()
    const guest = findGuest(room, guestName)
    if (!guest) {
      addLog({ type: 'error', ok: false, message: `Room ${room} / "${guestName}" not matched — ${orderCode} held for review` })
      return { ok: false, error: 'Guest not found for this room' }
    }
    if (settings.enforceCreditLimit && balanceOf(guest) + amount > guest.creditLimit) {
      addLog({ type: 'error', ok: false, message: `Credit limit exceeded for Room ${room} — ${orderCode} declined` })
      return { ok: false, error: 'Folio credit limit exceeded' }
    }
    const charge = { id: uid('chg'), at: Date.now(), description: `Dragon Pearl · ${orderCode}`, amount, source: 'restaurant', ref: orderCode }
    set((s) => ({ guests: s.guests.map((g) => (g.id === guest.id ? { ...g, charges: [...g.charges, charge] } : g)) }))
    addLog({ type: 'post', ok: true, message: `Posted ${orderCode} · ${formatMoney(amount)} to Room ${room} folio` })
    return { ok: true, guest, charge }
  },

  syncNow: () => {
    set((s) => ({ connection: { ...s.connection, lastSync: Date.now(), status: 'connected' } }))
    get().addLog({ type: 'sync', ok: true, message: `In-house guest list synchronised (${get().guests.length} rooms)` })
  },

  toggleSetting: (key) => set((s) => ({ settings: { ...s.settings, [key]: !s.settings[key] } })),

  setConnection: (status) => set((s) => ({ connection: { ...s.connection, status } })),
}))
