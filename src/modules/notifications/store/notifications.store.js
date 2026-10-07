import { createPersistedStore } from '@/core/store/createStore'
import { uid } from '@/core/lib/id'

export const CHANNELS = [
  { id: 'website', label: 'Website' },
  { id: 'sms', label: 'SMS' },
  { id: 'email', label: 'Email' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'push', label: 'Push' },
]

export const EVENT_TYPES = {
  customer: [
    { id: 'booking-confirmation', label: 'Booking confirmation', template: 'Hi {name}, your table for {guests} at Dragon Pearl is confirmed for {when}. Booking {code}.' },
    { id: 'order-confirmation', label: 'Order confirmation', template: 'Thank you {name}! Order #{code} ({total}) is confirmed. Track it live at dragonpearl.in/track/{code}' },
    { id: 'order-ready', label: 'Order ready', template: 'Good news {name} — order #{code} is ready! 🥢' },
    { id: 'delivery-update', label: 'Delivery update', template: 'Order #{code} is out for delivery with our rider. ETA 15 min.' },
    { id: 'payment-receipt', label: 'Payment receipt', template: 'Payment of {total} received for #{code}. GST invoice attached.' },
    { id: 'reservation-reminder', label: 'Reservation reminder', template: 'Reminder: your Dragon Pearl table is booked for today at {time}. See you soon!' },
    { id: 'special-offers', label: 'Special offers', template: '{message}' },
  ],
  restaurant: [
    { id: 'new-order', label: 'New order', template: 'New {type} order #{code} · {total}' },
    { id: 'new-reservation', label: 'New reservation', template: '{name} booked {guests} guests for {when}' },
    { id: 'payment-received', label: 'Payment received', template: '{total} received via {method}' },
    { id: 'cancellation', label: 'Cancellation', template: '{what} cancelled' },
    { id: 'low-inventory', label: 'Low inventory', template: '{item} below minimum ({stock})' },
    { id: 'pending-orders', label: 'Pending orders', template: '{count} orders waiting to be accepted' },
  ],
}

const allOn = (ids) => Object.fromEntries(ids.map((id) => [id, true]))
const defaultSettings = {
  'booking-confirmation': { website: true, sms: true, email: true, whatsapp: true, push: false },
  'order-confirmation': { website: true, sms: true, email: true, whatsapp: true, push: true },
  'order-ready': { website: true, sms: true, email: false, whatsapp: true, push: true },
  'delivery-update': { website: true, sms: true, email: false, whatsapp: true, push: true },
  'payment-receipt': { website: true, sms: false, email: true, whatsapp: true, push: false },
  'reservation-reminder': { website: false, sms: true, email: false, whatsapp: true, push: true },
  'special-offers': { website: true, sms: false, email: true, whatsapp: true, push: true },
  'new-order': allOn(['website', 'push']),
  'new-reservation': allOn(['website', 'email', 'push']),
  'payment-received': allOn(['website']),
  cancellation: allOn(['website', 'sms', 'push']),
  'low-inventory': allOn(['website', 'email', 'whatsapp']),
  'pending-orders': allOn(['website', 'push']),
}

const m = (mins) => Date.now() - mins * 60_000
const SEED = [
  { id: 'n1', audience: 'restaurant', kind: 'new-order', title: 'New order', body: 'New dine-in order #DP10245 · ₹1,499 · Table T05', at: m(1), read: false },
  { id: 'n2', audience: 'restaurant', kind: 'new-order', title: 'New order', body: 'New takeaway order #DP10241 · ₹803', at: m(2), read: false },
  { id: 'n3', audience: 'restaurant', kind: 'new-reservation', title: 'New reservation', body: 'Kenji Watanabe booked 3 guests for today 7:45 PM (via concierge)', at: m(14), read: false },
  { id: 'n4', audience: 'restaurant', kind: 'low-inventory', title: 'Low inventory', body: 'Oyster Sauce below minimum (3 L)', at: m(38), read: true },
  { id: 'n5', audience: 'customer', kind: 'order-ready', title: 'Order ready', body: 'Good news Sneha — order #DP10234 is ready! 🥢', at: m(31), read: true, channels: ['website', 'sms', 'whatsapp', 'push'] },
  { id: 'n6', audience: 'restaurant', kind: 'payment-received', title: 'Payment received', body: '₹1,416 posted to Room 312 folio', at: m(52), read: true },
  { id: 'n7', audience: 'customer', kind: 'reservation-reminder', title: 'Reservation reminder', body: 'Reminder: your table is booked for today at 7:00 PM.', at: m(90), read: true, channels: ['sms', 'whatsapp', 'push'] },
  { id: 'n8', audience: 'restaurant', kind: 'cancellation', title: 'Cancellation', body: 'Delivery order #DP10188 cancelled by customer', at: m(140), read: true },
]

export const useNotificationsStore = createPersistedStore('notifications', (set, get) => ({
  items: SEED,
  settings: defaultSettings,

  push: ({ audience, kind, title, body, meta }) => {
    const channels = Object.entries(get().settings[kind] ?? { website: true })
      .filter(([, on]) => on)
      .map(([c]) => c)
    const n = { id: uid('ntf'), audience, kind, title, body, meta, channels, at: Date.now(), read: false }
    set((s) => ({ items: [n, ...s.items].slice(0, 120) }))
    return n
  },

  markRead: (id) => set((s) => ({ items: s.items.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
  markAllRead: (audience) => set((s) => ({ items: s.items.map((n) => (!audience || n.audience === audience ? { ...n, read: true } : n)) })),
  toggleChannel: (kind, channel) => set((s) => ({ settings: { ...s.settings, [kind]: { ...s.settings[kind], [channel]: !s.settings[kind]?.[channel] } } })),
}))
