import { createPersistedStore } from '@/core/store/createStore'
import { uid } from '@/core/lib/id'
import { ROLES, STAFF } from '../data/staff.data'

export const useStaffStore = createPersistedStore('staff', (set, get) => ({
  roles: ROLES,
  staff: STAFF,

  roleOf: (roleId) => get().roles.find((r) => r.id === roleId),
  waiters: () => get().staff.filter((s) => s.role === 'waiter'),

  togglePermission: (roleId, key) =>
    set((s) => ({
      roles: s.roles.map((r) => {
        if (r.id !== roleId || r.locked) return r
        const has = r.permissions.includes(key)
        return { ...r, permissions: has ? r.permissions.filter((p) => p !== key) : [...r.permissions, key] }
      }),
    })),

  upsertStaff: (data) =>
    set((s) =>
      data.id
        ? { staff: s.staff.map((m) => (m.id === data.id ? { ...m, ...data } : m)) }
        : { staff: [...s.staff, { ...data, id: uid('staff'), joined: new Date().toISOString().slice(0, 10), rating: 4.5, ordersToday: 0, status: 'off' }] },
    ),

  setStatus: (id, status) => set((s) => ({ staff: s.staff.map((m) => (m.id === id ? { ...m, status } : m)) })),

  removeStaff: (id) => set((s) => ({ staff: s.staff.filter((m) => m.id !== id) })),
}))
