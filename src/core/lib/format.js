import { APP_CONFIG } from '@/core/config/app.config'

const { locale, currency } = APP_CONFIG.pricing

const inr = new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 })
const inrPrecise = new Intl.NumberFormat(locale, {
  style: 'currency',
  currency,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const num = new Intl.NumberFormat(locale)
const compact = new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 })

/** ₹1,48,500 */
export const formatMoney = (value, { precise = false } = {}) =>
  (precise || !Number.isInteger(Math.round(value * 100) / 100) ? inrPrecise : inr).format(value || 0)

export const formatNumber = (value) => num.format(value || 0)
export const formatCompact = (value) => compact.format(value || 0)

export const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100

export const formatTime = (date) =>
  new Date(date).toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' })

export const formatDate = (date, opts = {}) =>
  new Date(date).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric', ...opts })

export const formatDateTime = (date) => `${formatDate(date, { year: undefined })}, ${formatTime(date)}`

/** "4 min ago" style relative time. */
export function timeAgo(date) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000
  if (diff < 45) return 'just now'
  if (diff < 3600) return `${Math.round(diff / 60)} min ago`
  if (diff < 86400) return `${Math.round(diff / 3600)} h ago`
  return formatDate(date, { year: undefined })
}

/** mm:ss elapsed since `date` — used by KDS ticket timers. */
export function elapsed(date, now = Date.now()) {
  const s = Math.max(0, Math.floor((now - new Date(date).getTime()) / 1000))
  const m = Math.floor(s / 60)
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

/** "19:30" → "7:30 PM" */
export function to12h(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`
}

export const todayISO = () => new Date().toISOString().slice(0, 10)

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')
