import { createPersistedStore } from '@/core/store/createStore'
import { uid } from '@/core/lib/id'

/** Signed-in website customer (demo profile). */
export const useAccountStore = createPersistedStore('account', (set) => ({
  profile: { name: 'Ananya Rao', mobile: '98765 43210', email: 'ananya.rao@example.com', birthday: '1994-08-21', memberSince: '2023-02-14', dietary: 'Eats everything, loves spicy' },
  addresses: [
    { id: 'a1', label: 'Home', line: '8-2-293, Road No. 12, Banjara Hills', landmark: 'Opp. KBR Park', pincode: '500034', default: true },
    { id: 'a2', label: 'Office', line: 'Level 6, Cyber Towers, HITEC City', landmark: 'Gate 2', pincode: '500081', default: false },
  ],
  favourites: ['kung-pao', 'har-gow', 'schezwan-rice', 'wonton-sundae'],
  myOrderIds: ['DP10230', 'DP10214', 'DP10197', 'DP10176'],
  myReservationIds: ['RV2033', 'RV2040'],

  updateProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),
  toggleFavourite: (id) => set((s) => ({ favourites: s.favourites.includes(id) ? s.favourites.filter((f) => f !== id) : [...s.favourites, id] })),
  addAddress: (a) => set((s) => ({ addresses: [...s.addresses, { ...a, id: uid('addr'), default: false }] })),
  removeAddress: (id) => set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),
  setDefaultAddress: (id) => set((s) => ({ addresses: s.addresses.map((a) => ({ ...a, default: a.id === id })) })),
  trackOrder: (id) => set((s) => ({ myOrderIds: [id, ...s.myOrderIds.filter((x) => x !== id)] })),
  trackReservation: (id) => set((s) => ({ myReservationIds: [id, ...s.myReservationIds.filter((x) => x !== id)] })),
}))
