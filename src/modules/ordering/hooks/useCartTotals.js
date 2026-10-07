import { useOffersStore } from '@/modules/offers-loyalty'
import { useCartStore } from '../store/cart.store'
import { computeTotals, discountFor } from '../lib/pricing'

/** Derives live cart totals including any applied coupon. */
export function useCartTotals({ type, extraDiscount = 0 } = {}) {
  const lines = useCartStore((s) => s.lines)
  const orderType = useCartStore((s) => s.orderType)
  const couponCode = useCartStore((s) => s.couponCode)
  const offer = useOffersStore((s) => (couponCode ? s.findByCode(couponCode) : null))
  const couponDiscount = discountFor(offer, lines)
  const totals = computeTotals(lines, { type: type ?? orderType, discount: couponDiscount + extraDiscount })
  return { lines, totals, offer, couponDiscount }
}
