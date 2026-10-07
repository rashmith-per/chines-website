import { createPersistedStore } from '@/core/store/createStore'

export const ZONES = ['Window', 'Indoor', 'Family Area', 'Private Dining']

export const TABLE_STATUS = {
  available: { label: 'Available', tone: 'jade', fill: 'bg-jade-500/12 border-jade-500/40 text-jade-700 dark:text-jade-200' },
  occupied: { label: 'Occupied', tone: 'red', fill: 'bg-lacquer-500/12 border-lacquer-500/40 text-lacquer-700 dark:text-lacquer-200' },
  reserved: { label: 'Reserved', tone: 'amber', fill: 'bg-amber-500/12 border-amber-500/40 text-amber-700 dark:text-amber-200' },
  cleaning: { label: 'Cleaning', tone: 'blue', fill: 'bg-sky-500/10 border-sky-500/40 text-sky-700 dark:text-sky-200' },
}

const T = (id, capacity, zone, status = 'available', extra = {}) => ({ id, capacity, zone, status, guest: null, waiter: null, seatedAt: null, ...extra })

const SEED = [
  T('T01', 2, 'Window'),
  T('T02', 2, 'Window', 'occupied', { guest: 'Priya Menon', waiter: 'Anil Verma', seatedAt: Date.now() - 28 * 60_000, covers: 2 }),
  T('T03', 4, 'Window', 'reserved', { guest: 'Sneha Kapoor' }),
  T('T04', 4, 'Indoor', 'cleaning'),
  T('T05', 4, 'Indoor', 'occupied', { guest: 'Rahul Sharma', waiter: 'Ravi Teja', seatedAt: Date.now() - 9 * 60_000, covers: 4 }),
  T('T06', 4, 'Indoor'),
  T('T07', 6, 'Family Area', 'occupied', { guest: 'Karthik Reddy', waiter: 'Ravi Teja', seatedAt: Date.now() - 22 * 60_000, covers: 5 }),
  T('T08', 6, 'Family Area', 'reserved', { guest: 'Arjun Rao' }),
  T('T09', 8, 'Family Area'),
  T('PD1', 10, 'Private Dining'),
  T('PD2', 12, 'Private Dining', 'reserved', { guest: 'Infosys Team Dinner' }),
]

export const useTablesStore = createPersistedStore('tables', (set, get) => ({
  tables: SEED,

  getTable: (id) => get().tables.find((t) => t.id === id),

  patchTable: (id, patch) => set((s) => ({ tables: s.tables.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),

  seat: (id, { guest = 'Walk-in', waiter = null, covers } = {}) =>
    get().patchTable(id, { status: 'occupied', guest, waiter, covers, seatedAt: Date.now() }),

  reserve: (id, guest) => get().patchTable(id, { status: 'reserved', guest }),

  release: (id) => get().patchTable(id, { status: 'cleaning', guest: null, waiter: null, seatedAt: null, covers: null }),

  markAvailable: (id) => get().patchTable(id, { status: 'available', guest: null, waiter: null, seatedAt: null, covers: null }),
}))
