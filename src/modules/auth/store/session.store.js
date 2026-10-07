import { createPersistedStore } from '@/core/store/createStore'
import { useStaffStore } from '@/modules/staff'

/** Back-office session (front-end only demo auth). */
export const useSessionStore = createPersistedStore('session', (set) => ({
  userId: null,
  signIn: (userId) => set({ userId }),
  signOut: () => set({ userId: null }),
}))

/** Current staff user joined with their role. */
export function useCurrentUser() {
  const userId = useSessionStore((s) => s.userId)
  const staff = useStaffStore((s) => s.staff)
  const roles = useStaffStore((s) => s.roles)
  const user = staff.find((m) => m.id === userId)
  if (!user) return null
  return { ...user, roleInfo: roles.find((r) => r.id === user.role) }
}

/** Permission check hook: `const can = usePermission(); can('pos.bill')` */
export function usePermission() {
  const user = useCurrentUser()
  return (key) => (!key ? true : !!user?.roleInfo?.permissions.includes(key))
}
