/**
 * Global, business-agnostic configuration for the Dragon Pearl platform.
 * Every module reads brand / pricing constants from here so they stay in sync.
 */
export const APP_CONFIG = Object.freeze({
  brand: {
    name: 'Dragon Pearl',
    cjk: '龍珠',
    tagline: 'Authentic Chinese Cuisine · Hotel Dining · Takeaway & Delivery',
    hotel: 'The Grand Meridian',
    phone: '+91 40 4567 8910',
    whatsapp: '914045678910',
    email: 'reservations@dragonpearl.in',
    address: {
      line1: 'Ground Floor, The Grand Meridian',
      line2: 'Banjara Hills, Hyderabad, Telangana 500034',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Banjara+Hills+Hyderabad',
    },
    socials: { instagram: '#', facebook: '#', x: '#' },
  },
  timings: [
    { label: 'Breakfast', time: '7:00 AM – 10:30 AM', from: '07:00', to: '10:30' },
    { label: 'Lunch', time: '12:00 PM – 3:30 PM', from: '12:00', to: '15:30' },
    { label: 'Dinner', time: '7:00 PM – 11:30 PM', from: '19:00', to: '23:30' },
  ],
  pricing: {
    currency: 'INR',
    locale: 'en-IN',
    taxRate: 0.18, // GST
    deliveryFee: 50,
    freeDeliveryAbove: 1500,
    packagingFee: 0,
  },
  loyalty: {
    pointsPerRupee: 0.1, // 1 point / ₹10
    rupeesPerPoint: 0.1, // 10 points = ₹1 → 1,250 pts = ₹125
  },
})

export const ORDER_TYPES = Object.freeze({
  DINE_IN: 'dine-in',
  TAKEAWAY: 'takeaway',
  DELIVERY: 'delivery',
  ROOM_SERVICE: 'room-service',
})

/**
 * Chart colours are a validated categorical palette (CVD ΔE ≥ 8 for adjacent pairs, light & dark).
 * Keep series in CHART_SERIES_ORDER so adjacent hues stay distinguishable.
 */
export const ORDER_TYPE_META = {
  [ORDER_TYPES.DINE_IN]: { label: 'Dine-In', color: '#c08428' },
  [ORDER_TYPES.TAKEAWAY]: { label: 'Takeaway', color: '#0fa07f' },
  [ORDER_TYPES.ROOM_SERVICE]: { label: 'Room Service', color: '#7b7ef2' },
  [ORDER_TYPES.DELIVERY]: { label: 'Delivery', color: '#e0405a' },
}
export const CHART_SERIES_ORDER = [ORDER_TYPES.DINE_IN, ORDER_TYPES.TAKEAWAY, ORDER_TYPES.ROOM_SERVICE, ORDER_TYPES.DELIVERY]
export const CHART_PALETTE = ['#c08428', '#0fa07f', '#7b7ef2', '#e0405a']

export const PAYMENT_METHODS = Object.freeze({
  UPI: 'upi',
  CARD: 'card',
  CASH: 'cash',
  PAY_AT_RESTAURANT: 'pay-at-restaurant',
  ROOM_CHARGE: 'room-charge',
})

export const PAYMENT_META = {
  upi: { label: 'UPI' },
  card: { label: 'Card' },
  cash: { label: 'Cash' },
  'pay-at-restaurant': { label: 'Pay at Restaurant' },
  'room-charge': { label: 'Charge to Room' },
}
