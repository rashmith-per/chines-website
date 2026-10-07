import { createPersistedStore } from '@/core/store/createStore'
import { publish, EVENTS } from '@/core/events/eventBus'
import { sequenceCode } from '@/core/lib/id'
import { todayISO } from '@/core/lib/format'
import { useTablesStore } from '@/modules/tables'

const day = (offset) => new Date(Date.now() + offset * 86_400_000).toISOString().slice(0, 10)

const R = (code, name, guests, time, tableId, status, seating, offset = 0, extra = {}) => ({
  id: code,
  code,
  name,
  mobile: `98${String(code).slice(-4)}${String(code).slice(-4)}`,
  email: '',
  date: day(offset),
  time,
  guests,
  seating,
  tableId,
  status,
  request: '',
  source: 'website',
  createdAt: Date.now() - 86_400_000,
  ...extra,
})

const SEED = [
  R('RV2031', 'Sneha Kapoor', 4, '13:00', 'T03', 'confirmed', 'Window', 0, { request: 'Anniversary — please arrange a small cake' }),
  R('RV2032', 'Rahul Sharma', 4, '19:00', 'T05', 'confirmed', 'Indoor'),
  R('RV2033', 'Priya Menon', 2, '19:30', 'T02', 'confirmed', 'Window'),
  R('RV2034', 'Arjun Rao', 6, '20:00', 'T08', 'pending', 'Family Table', 0, { request: 'High chair for a toddler' }),
  R('RV2035', 'Infosys Team Dinner', 12, '20:30', 'PD2', 'confirmed', 'Private Dining', 0, { source: 'phone' }),
  R('RV2036', 'Divya Iyer', 2, '21:00', null, 'pending', 'Window'),
  R('RV2037', 'Kenji Watanabe', 3, '19:45', 'T06', 'confirmed', 'Indoor', 0, { source: 'hotel concierge' }),
  R('RV2038', 'Meghana Pillai', 4, '13:30', 'T04', 'confirmed', 'Indoor', 1),
  R('RV2039', 'Siddharth Jain', 8, '20:00', 'T09', 'pending', 'Family Table', 1),
  R('RV2040', 'Tanvi Kulkarni', 2, '19:30', 'T01', 'confirmed', 'Window', 2),
]

const PREF_ZONE = { Indoor: 'Indoor', Window: 'Window', 'Private Dining': 'Private Dining', 'Family Table': 'Family Area' }
const toMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export const useReservationsStore = createPersistedStore('reservations', (set, get) => ({
  reservations: SEED,

  /** Tables that fit the party and are free ±90 min around the requested slot. */
  checkAvailability: ({ date, time, guests, seating }) => {
    const tables = useTablesStore.getState().tables
    const busy = new Set(
      get()
        .reservations.filter((r) => r.date === date && r.tableId && !['cancelled', 'completed'].includes(r.status) && Math.abs(toMin(r.time) - toMin(time)) < 90)
        .map((r) => r.tableId),
    )
    const zone = PREF_ZONE[seating]
    return tables
      .filter((t) => t.capacity >= guests && t.capacity <= guests + 6 && !busy.has(t.id))
      .filter((t) => !(date === todayISO() && t.status === 'occupied' && Math.abs(toMin(time) - (new Date().getHours() * 60 + new Date().getMinutes())) < 60))
      .sort((a, b) => (a.zone === zone ? -1 : 0) - (b.zone === zone ? -1 : 0) || a.capacity - b.capacity)
  },

  create: (data) => {
    const code = sequenceCode('RV', get().reservations.map((r) => r.code), 2000)
    const reservation = { id: code, code, status: 'confirmed', createdAt: Date.now(), source: 'website', ...data }
    set((s) => ({ reservations: [reservation, ...s.reservations] }))
    publish(EVENTS.RESERVATION_CREATED, reservation)
    return reservation
  },

  update: (id, patch, { silent = false } = {}) => {
    set((s) => ({ reservations: s.reservations.map((r) => (r.id === id ? { ...r, ...patch } : r)) }))
    const updated = get().reservations.find((r) => r.id === id)
    if (!silent) publish(patch.status === 'cancelled' ? EVENTS.RESERVATION_CANCELLED : EVENTS.RESERVATION_UPDATED, updated)
    return updated
  },
}))

export { toMin }
