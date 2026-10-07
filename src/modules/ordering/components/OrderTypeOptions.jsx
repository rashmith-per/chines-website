import { AnimatePresence, motion } from 'framer-motion'
import { Clock, MapPin } from 'lucide-react'
import { Input, Field, Select } from '@/core/ui'
import { cn } from '@/core/lib/cn'
import { APP_CONFIG, ORDER_TYPES, ORDER_TYPE_META } from '@/core/config/app.config'
import { useCartStore } from '../store/cart.store'
import { TYPE_ICONS } from './OrderBits'

export const PICKUP_SLOTS = ['ASAP – 20 minutes', '12:30 PM', '1:00 PM', '7:30 PM', '8:00 PM']
const BLURB = {
  'dine-in': 'Order ahead to your table',
  takeaway: 'Pick up from the restaurant',
  delivery: 'Delivered hot to your door',
  'room-service': 'Delivered to your hotel room',
}

/** Big animated order-type selector cards. */
export function OrderTypeSelector({ types = [ORDER_TYPES.DINE_IN, ORDER_TYPES.TAKEAWAY, ORDER_TYPES.DELIVERY], value, onChange }) {
  return (
    <div className={cn('grid gap-3', types.length === 4 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-3')}>
      {types.map((t) => {
        const Icon = TYPE_ICONS[t]
        const active = value === t
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={cn(
              'group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300',
              active ? 'border-gold-400/70 bg-gold-400/10' : 'border-line bg-surface/60 hover:border-line-strong',
            )}
          >
            {active && <motion.span layoutId={`otype-${types.length}`} className="absolute inset-0 bg-gradient-to-br from-gold-400/15 via-transparent to-lacquer-500/10" />}
            <Icon className={cn('relative size-6 transition-colors', active ? 'text-gold-300' : 'text-muted group-hover:text-fg')} />
            <div className="relative mt-3 font-semibold">{ORDER_TYPE_META[t].label}</div>
            <div className="relative mt-0.5 hidden text-xs text-muted sm:block">{BLURB[t]}</div>
          </button>
        )
      })}
    </div>
  )
}

/** Conditional details for the selected order type (delivery address, pickup slot, table). */
export function OrderTypeDetails({ type }) {
  const { delivery, setDelivery, pickupTime, setPickupTime, tableId, setTable } = useCartStore()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={type} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden">
        <div className="pt-5">
          {type === ORDER_TYPES.DELIVERY && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Mobile Number" required>
                <Input inputMode="tel" placeholder="98765 43210" value={delivery.mobile} onChange={(e) => setDelivery({ mobile: e.target.value })} />
              </Field>
              <Field label="Pincode" required>
                <Input inputMode="numeric" maxLength={6} placeholder="500034" value={delivery.pincode} onChange={(e) => setDelivery({ pincode: e.target.value })} />
              </Field>
              <Field label="Delivery Address" required className="sm:col-span-2">
                <Input icon={MapPin} placeholder="Flat / House no., street, area" value={delivery.address} onChange={(e) => setDelivery({ address: e.target.value })} />
              </Field>
              <Field label="Landmark" className="sm:col-span-2">
                <Input placeholder="Near…" value={delivery.landmark} onChange={(e) => setDelivery({ landmark: e.target.value })} />
              </Field>
            </div>
          )}

          {type === ORDER_TYPES.TAKEAWAY && (
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Pickup Time</div>
                <div className="flex flex-wrap gap-2">
                  {PICKUP_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setPickupTime(slot)}
                      className={cn('flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-semibold transition', pickupTime === slot ? 'border-gold-400 bg-gold-400 text-ink-950' : 'border-line text-muted hover:border-line-strong hover:text-fg')}
                    >
                      <Clock className="size-3.5" />
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface-2/50 p-4">
                <MapPin className="mt-0.5 size-5 text-gold-400" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Pickup Location</div>
                  <div className="mt-1 font-semibold">{APP_CONFIG.brand.name} Restaurant</div>
                  <div className="text-sm text-muted">{APP_CONFIG.brand.address.line1}</div>
                </div>
              </div>
            </div>
          )}

          {type === ORDER_TYPES.DINE_IN && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your Table" hint="Find the number on your table's QR stand.">
                <Select value={tableId} onChange={(e) => setTable(e.target.value)}>
                  <option value="">Select table</option>
                  {['T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'PD1', 'PD2'].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Select>
              </Field>
              <div className="flex items-center rounded-2xl border border-dashed border-line-strong p-4 text-sm text-muted">
                Your order goes straight to our kitchen display — your waiter will serve it hot.
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
