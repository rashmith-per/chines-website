import { APP_CONFIG, ORDER_TYPES } from '@/core/config/app.config'
import { round2 } from '@/core/lib/format'

const { taxRate, deliveryFee, freeDeliveryAbove } = APP_CONFIG.pricing

/**
 * Single source of truth for bill maths (website cart, checkout, POS, room service).
 * GST is applied on the post-discount amount.
 *
 * @param {{price:number, qty:number}[]} lines
 * @param {{type?:string, discount?:number, rounding?:'rupee'|'paise'}} opts
 */
export function computeTotals(lines, { type, discount = 0, rounding = 'rupee' } = {}) {
  const r = rounding === 'rupee' ? Math.round : round2
  const subtotal = round2(lines.reduce((sum, l) => sum + l.price * l.qty, 0))
  const disc = Math.min(round2(discount), subtotal)
  const taxable = subtotal - disc
  const tax = r(taxable * taxRate)
  const delivery = type === ORDER_TYPES.DELIVERY && subtotal > 0 && subtotal < freeDeliveryAbove ? deliveryFee : 0
  const total = round2(taxable + tax + delivery)
  const itemCount = lines.reduce((n, l) => n + l.qty, 0)
  return { subtotal, discount: disc, tax, deliveryFee: delivery, total, itemCount }
}

/** Resolve a coupon/offer into a rupee discount for the given lines. */
export function discountFor(offer, lines) {
  if (!offer) return 0
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0)
  if (offer.minOrder && subtotal < offer.minOrder) return 0
  const base = offer.categories?.length
    ? lines.filter((l) => offer.categories.includes(l.category)).reduce((s, l) => s + l.price * l.qty, 0)
    : subtotal
  const value = offer.kind === 'percent' ? (base * offer.value) / 100 : offer.value
  return Math.round(Math.min(value, offer.maxDiscount ?? Infinity))
}
