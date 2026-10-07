import { seeded } from '@/core/lib/id'

/**
 * Historical sales ledger (synthetic but deterministic) used by the reports module.
 * In production this would come from the reporting API; the shape mirrors that contract.
 */
const CHANNEL_SHARE = { 'dine-in': 0.44, takeaway: 0.15, delivery: 0.24, 'room-service': 0.17 }
const PAY_SHARE = { cash: 0.18, upi: 0.42, card: 0.25, room: 0.15 }

function bucket(label, total, rand, extra = {}) {
  const jitter = () => 0.9 + rand() * 0.2
  const ch = Object.fromEntries(Object.entries(CHANNEL_SHARE).map(([k, v]) => [k, v * jitter()]))
  const chSum = Object.values(ch).reduce((a, b) => a + b, 0)
  const channels = Object.fromEntries(Object.entries(ch).map(([k, v]) => [k, Math.round((v / chSum) * total)]))
  const pay = Object.fromEntries(Object.entries(PAY_SHARE).map(([k, v]) => [k, Math.round(v * total * jitter())]))
  const paySum = Object.values(pay).reduce((a, b) => a + b, 0)
  Object.keys(pay).forEach((k) => (pay[k] = Math.round((pay[k] / paySum) * total)))
  const orders = Math.round(total / (1080 + rand() * 180))
  return {
    label,
    total,
    ...channels,
    ...pay,
    orders,
    online: Math.round(orders * (0.36 + rand() * 0.08)),
    discounts: Math.round(total * (0.035 + rand() * 0.015)),
    tax: Math.round((total / 1.18) * 0.18),
    ...extra,
  }
}

export function dailySeries(days = 30) {
  const rand = seeded(77)
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(Date.now() - (days - 1 - i) * 86_400_000)
    const weekend = [0, 5, 6].includes(d.getDay())
    const total = Math.round((78000 + rand() * 26000) * (weekend ? 1.32 : 1))
    return bucket(d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), total, rand, { date: d.toISOString().slice(0, 10) })
  })
}

export function weeklySeries(weeks = 12) {
  const rand = seeded(91)
  return Array.from({ length: weeks }, (_, i) => {
    const start = new Date(Date.now() - (weeks - 1 - i) * 7 * 86_400_000)
    return bucket(`Wk of ${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`, Math.round(590000 + rand() * 140000 + i * 4500), rand)
  })
}

/** Monthly — October 2026 matches the reference figures in the requirement spec. */
export function monthlySeries() {
  const rand = seeded(13)
  const months = Array.from({ length: 12 }, (_, i) => new Date(2025, 10 + i, 1)) // Nov 2025 → Oct 2026
  return months.map((m, i) => {
    const label = m.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
    if (i === 11) {
      const b = bucket('Oct 26', 2845600, rand)
      return { ...b, 'dine-in': 1250000, takeaway: 425000, delivery: 680000, 'room-service': 490600, fullLabel: 'October 2026' }
    }
    return { ...bucket(label, Math.round(2180000 + rand() * 420000 + i * 26000), rand), fullLabel: m.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) }
  })
}
