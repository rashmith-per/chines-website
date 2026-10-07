import { MENU_ITEMS } from '@/modules/catalog/data/menu.data'
import { seeded } from '@/core/lib/id'
import { computeTotals } from '../lib/pricing'

/**
 * Generates a realistic "today so far" order book (126 orders, ~₹1.5L) so the
 * dashboards, KDS and reports are alive on first load.
 * NOTE: seed files are module-internal; importing catalog data directly here is the
 * one sanctioned exception because it only runs once to build fixtures.
 */
const NAMES = ['Rahul Sharma', 'Priya Menon', 'Arjun Rao', 'Sneha Kapoor', 'Karthik Reddy', 'Divya Iyer', 'Rohan Gupta', 'Ananya Rao', 'Vivek Nair', 'Pooja Desai', 'Aditya Varma', 'Kavya Shetty', 'Naveen Kumar', 'Isha Malhotra', 'Siddharth Jain', 'Meghana Pillai', 'Farhan Ali', 'Neha Bansal', 'Harsha Vardhan', 'Tanvi Kulkarni']
const ROOMS = [['504', 'Naveen Kumar'], ['312', 'Isha Malhotra'], ['708', 'David Miller'], ['215', 'Sophie Laurent'], ['901', 'Kenji Watanabe'], ['606', 'Aarav Mehta']]
const WAITERS = ['Ravi Teja', 'Anil Verma', 'Priya Nair']
const TABLES = ['T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09']
const PAY = { 'dine-in': ['cash', 'upi', 'card', 'upi'], takeaway: ['upi', 'card', 'cash'], delivery: ['upi', 'card', 'upi'], 'room-service': ['room-charge', 'room-charge', 'card'] }

const byId = Object.fromEntries(MENU_ITEMS.map((m) => [m.id, m]))
const line = (id, qty) => {
  const m = byId[id]
  return { id: m.id, name: m.name, price: m.price, qty, station: m.station, category: m.category, veg: m.veg, image: m.image }
}

function buildOrder({ code, type, status, items, minutesAgo, rand, extra = {} }) {
  const createdAt = Date.now() - minutesAgo * 60_000
  const totals = computeTotals(items, { type })
  const flow = ['received', 'confirmed', 'preparing', 'ready', 'completed']
  const reached = flow.slice(0, flow.indexOf(status) + 1)
  const timeline = reached.map((s, i) => ({ status: s, at: createdAt + i * 6 * 60_000 }))
  const name = NAMES[Math.floor(rand() * NAMES.length)]
  const methods = PAY[type]
  const method = methods[Math.floor(rand() * methods.length)]
  const paid = status === 'completed' || type !== 'dine-in'
  return {
    id: code,
    code,
    type,
    status,
    items,
    customer: { name, mobile: `98${Math.floor(10000000 + rand() * 89999999)}`, email: '' },
    payment: { method, status: method === 'room-charge' ? 'room-charged' : paid ? 'paid' : 'pending' },
    pricing: totals,
    source: type === 'dine-in' ? 'pos' : rand() > 0.35 ? 'web' : 'phone',
    createdAt,
    timeline,
    ...extra,
  }
}

export function seedOrders() {
  const rand = seeded(2026)
  const ids = MENU_ITEMS.map((m) => m.id)
  const mix = [...Array(42).fill('dine-in'), ...Array(31).fill('takeaway'), ...Array(38).fill('delivery'), ...Array(15).fill('room-service')]
  // shuffle deterministically
  for (let i = mix.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[mix[i], mix[j]] = [mix[j], mix[i]]
  }

  const orders = []
  let dp = 10120
  let rs = 1011
  // Historic (completed) orders spread through the day
  const historic = mix.slice(0, mix.length - 12)
  historic.forEach((type, idx) => {
    const n = 2 + Math.floor(rand() * 2)
    const items = Array.from({ length: n }, () => line(ids[Math.floor(rand() * ids.length)], rand() > 0.85 ? 2 : 1))
    const code = type === 'room-service' ? `RS${rs++}` : `DP${dp++}`
    const minutesAgo = 50 + Math.round(((historic.length - idx) / historic.length) * 600)
    orders.push(
      buildOrder({
        code,
        type,
        status: rand() > 0.97 ? 'cancelled' : 'completed',
        items,
        minutesAgo,
        rand,
        extra: extrasFor(type, rand),
      }),
    )
  })

  // Live, in-kitchen orders (these drive KDS / tables / tracking)
  const live = [
    { type: 'takeaway', status: 'ready', items: [line('honey-potato', 1), line('veg-hakka', 1)], minutesAgo: 34, extra: { pickupTime: 'ASAP' } },
    { type: 'delivery', status: 'ready', items: [line('kung-pao', 1), line('garlic-rice', 1)], minutesAgo: 31 },
    { type: 'dine-in', status: 'preparing', items: [line('sui-mai', 2), line('jasmine-tea', 1)], minutesAgo: 22, extra: { tableId: 'T02', waiter: 'Anil Verma' } },
    { type: 'room-service', status: 'preparing', items: [line('shoyu-egg-noodle', 1), line('lemongrass-iced-tea', 1)], minutesAgo: 19 },
    { type: 'delivery', status: 'preparing', items: [line('chicken-manchurian', 1), line('schezwan-rice', 1), line('wonton-sundae', 1)], minutesAgo: 16 },
    { type: 'dine-in', status: 'preparing', items: [line('lions-head', 1), line('dan-dan', 1), line('har-gow', 1)], minutesAgo: 14, extra: { tableId: 'T07', waiter: 'Ravi Teja' } },
    { type: 'takeaway', status: 'confirmed', items: [line('chilli-garlic-noodles', 2)], minutesAgo: 9, extra: { pickupTime: '12:30 PM' } },
    { type: 'delivery', status: 'confirmed', items: [line('mapo-tofu', 1), line('jasmine-rice', 2)], minutesAgo: 7 },
    { type: 'room-service', status: 'received', items: [line('ginger-fish', 1), line('garlic-rice', 1), line('chrysanthemum-tea', 2)], minutesAgo: 4 },
    { type: 'delivery', status: 'received', items: [line('dragon-chicken', 1), line('prawn-chow-fun', 1)], minutesAgo: 3 },
    { type: 'takeaway', status: 'received', items: [line('veg-crystal', 1), line('buddhas-delight', 1)], minutesAgo: 2, extra: { pickupTime: 'ASAP' } },
    // PDF reference ticket: #DP10245 · T05 · waiter Ravi
    { type: 'dine-in', status: 'received', items: [line('chicken-manchurian', 1), line('veg-hakka', 2), line('schezwan-rice', 1)], minutesAgo: 1, extra: { tableId: 'T05', waiter: 'Ravi Teja' } },
  ]
  live.forEach((o, i) => {
    const isRoom = o.type === 'room-service'
    const code = isRoom ? `RS${rs++}` : i === live.length - 1 ? 'DP10245' : `DP${dp++}`
    orders.push(buildOrder({ code, rand, ...o, extra: { ...extrasFor(o.type, rand), ...o.extra } }))
  })

  return orders.sort((a, b) => b.createdAt - a.createdAt)
}

function extrasFor(type, rand) {
  if (type === 'dine-in') return { tableId: TABLES[Math.floor(rand() * TABLES.length)], waiter: WAITERS[Math.floor(rand() * WAITERS.length)] }
  if (type === 'room-service') {
    const [number, guestName] = ROOMS[Math.floor(rand() * ROOMS.length)]
    return { room: { number, guestName } }
  }
  if (type === 'delivery') return { delivery: { address: `${Math.floor(rand() * 900) + 100}, Road No. ${Math.floor(rand() * 12) + 1}, Jubilee Hills`, landmark: 'Near Peddamma Temple', pincode: '500033' } }
  return { pickupTime: 'ASAP' }
}
