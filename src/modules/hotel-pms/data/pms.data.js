const day = 86_400_000
const d = (offset) => new Date(Date.now() + offset * day).toISOString().slice(0, 10)

export const GUESTS = [
  { id: 'g1', name: 'Naveen Kumar', title: 'Mr.', room: '504', roomType: 'Deluxe King', checkIn: d(-2), checkOut: d(2), adults: 2, vip: true, creditLimit: 25000, roomRate: 8500,
    charges: [
      { id: 'c1', at: Date.now() - 1.6 * day, description: 'Room charge — Deluxe King', amount: 8500, source: 'room' },
      { id: 'c2', at: Date.now() - 1.2 * day, description: 'Dragon Pearl · RS1019', amount: 1250, source: 'restaurant', ref: 'RS1019' },
      { id: 'c3', at: Date.now() - 0.6 * day, description: 'Room charge — Deluxe King', amount: 8500, source: 'room' },
      { id: 'c4', at: Date.now() - 0.3 * day, description: 'Laundry express', amount: 650, source: 'other' },
    ] },
  { id: 'g2', name: 'Isha Malhotra', title: 'Ms.', room: '312', roomType: 'Premier Twin', checkIn: d(-1), checkOut: d(1), adults: 1, vip: false, creditLimit: 15000, roomRate: 7200,
    charges: [{ id: 'c5', at: Date.now() - 0.8 * day, description: 'Room charge — Premier Twin', amount: 7200, source: 'room' }] },
  { id: 'g3', name: 'David Miller', title: 'Mr.', room: '708', roomType: 'Executive Suite', checkIn: d(-3), checkOut: d(0), adults: 2, vip: true, creditLimit: 40000, roomRate: 14500,
    charges: [
      { id: 'c6', at: Date.now() - 2.5 * day, description: 'Room charge — Executive Suite', amount: 14500, source: 'room' },
      { id: 'c7', at: Date.now() - 2.1 * day, description: 'Dragon Pearl · RS1012', amount: 2380, source: 'restaurant', ref: 'RS1012' },
      { id: 'c8', at: Date.now() - 1.5 * day, description: 'Room charge — Executive Suite', amount: 14500, source: 'room' },
      { id: 'c9', at: Date.now() - 1.1 * day, description: 'Spa — Deep tissue', amount: 4200, source: 'other' },
    ] },
  { id: 'g4', name: 'Sophie Laurent', title: 'Ms.', room: '215', roomType: 'Deluxe Queen', checkIn: d(0), checkOut: d(4), adults: 2, vip: false, creditLimit: 20000, roomRate: 7800, charges: [] },
  { id: 'g5', name: 'Kenji Watanabe', title: 'Mr.', room: '901', roomType: 'Presidential Suite', checkIn: d(-1), checkOut: d(3), adults: 3, vip: true, creditLimit: 80000, roomRate: 32000,
    charges: [{ id: 'c10', at: Date.now() - 0.9 * day, description: 'Room charge — Presidential Suite', amount: 32000, source: 'room' }] },
  { id: 'g6', name: 'Aarav Mehta', title: 'Mr.', room: '606', roomType: 'Deluxe King', checkIn: d(-4), checkOut: d(1), adults: 2, vip: false, creditLimit: 20000, roomRate: 8500,
    charges: [
      { id: 'c11', at: Date.now() - 3.4 * day, description: 'Room charge — Deluxe King', amount: 8500, source: 'room' },
      { id: 'c12', at: Date.now() - 2.2 * day, description: 'Dragon Pearl · RS1015', amount: 1840, source: 'restaurant', ref: 'RS1015' },
    ] },
]

export const SYNC_LOG = [
  { id: 'l1', at: Date.now() - 4 * 60_000, type: 'sync', message: 'In-house guest list synchronised (6 rooms)', ok: true },
  { id: 'l2', at: Date.now() - 52 * 60_000, type: 'post', message: 'Posted RS1023 · ₹1,416 to Room 312 folio', ok: true },
  { id: 'l3', at: Date.now() - 3 * 3600_000, type: 'error', message: 'Room 1102 not found — charge held for review', ok: false },
  { id: 'l4', at: Date.now() - 5 * 3600_000, type: 'sync', message: 'Night audit completed — folios rolled over', ok: true },
]
