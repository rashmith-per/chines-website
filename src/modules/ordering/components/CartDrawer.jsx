import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react'
import { Drawer, Button, QuantityStepper, SmartImage, EmptyState } from '@/core/ui'
import { img } from '@/core/lib/image'
import { formatMoney } from '@/core/lib/format'
import { APP_CONFIG } from '@/core/config/app.config'
import { useCartStore } from '../store/cart.store'
import { useCartTotals } from '../hooks/useCartTotals'
import { TotalsBlock } from './OrderBits'

export function CartDrawer() {
  const { isOpen, close, lines, setQty, remove, orderType } = useCartStore()
  const { totals } = useCartTotals()
  const navigate = useNavigate()
  const remainingForFree = APP_CONFIG.pricing.freeDeliveryAbove - totals.subtotal

  return (
    <Drawer open={isOpen} onClose={close} title="Your Order" subtitle={`${totals.itemCount} item${totals.itemCount === 1 ? '' : 's'} · ${orderType.replace('-', ' ')}`}
      footer={
        lines.length > 0 && (
          <div className="space-y-4">
            <TotalsBlock totals={totals} />
            <Button className="w-full" size="lg" iconRight={ArrowRight} onClick={() => { close(); navigate('/checkout') }}>
              Proceed to Checkout
            </Button>
          </div>
        )
      }
    >
      {lines.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="Your cart is empty" description="Explore the menu and add a few favourites." action={<Button variant="gold" onClick={() => { close(); navigate('/order') }}>Browse Menu</Button>} className="py-24" />
      ) : (
        <div className="space-y-3 p-5">
          {orderType === 'delivery' && remainingForFree > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-gold-400/25 bg-gold-400/8 px-3.5 py-2.5 text-xs text-gold-200">
              <Sparkles className="size-4 shrink-0" />
              Add {formatMoney(remainingForFree)} more for free delivery
            </div>
          )}
          <AnimatePresence initial={false}>
            {lines.map((l) => (
              <motion.div key={l.id} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30, height: 0 }} className="flex items-center gap-3 rounded-2xl border border-line bg-surface-2/50 p-2.5">
                <SmartImage src={img(l.image, { w: 160, h: 160 })} alt={l.name} className="size-16 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{l.name}</div>
                  <div className="text-xs text-muted">{formatMoney(l.price)} each</div>
                  <div className="mt-2 flex items-center justify-between">
                    <QuantityStepper size="sm" value={l.qty} onChange={(q) => setQty(l, q)} />
                    <span className="font-semibold tabular-nums">{formatMoney(l.price * l.qty)}</span>
                  </div>
                </div>
                <button onClick={() => remove(l.id)} className="self-start rounded-lg p-1.5 text-muted hover:bg-lacquer-500/10 hover:text-lacquer-400" aria-label={`Remove ${l.name}`}>
                  <Trash2 className="size-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </Drawer>
  )
}

/** Navbar cart trigger with bouncing count badge. */
export function CartButton({ className }) {
  const count = useCartStore((s) => s.lines.reduce((n, l) => n + l.qty, 0))
  const open = useCartStore((s) => s.open)
  return (
    <button onClick={open} className={`relative grid size-11 place-items-center rounded-xl border border-line text-fg transition hover:border-gold-400/50 hover:text-gold-300 ${className ?? ''}`} aria-label="Open cart">
      <ShoppingBag className="size-5" />
      <AnimatePresence>
        {count > 0 && (
          <motion.span key={count} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }} className="absolute -right-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-lacquer-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-lacquer-500/40">
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
