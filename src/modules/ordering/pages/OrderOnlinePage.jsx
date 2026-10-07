import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHero, Button, SmartImage, QuantityStepper } from '@/core/ui'
import { Reveal } from '@/core/animation/Reveal'
import { img } from '@/core/lib/image'
import { formatMoney } from '@/core/lib/format'
import { useDocumentTitle } from '@/core/hooks'
import { useCartStore } from '../store/cart.store'
import { useCartTotals } from '../hooks/useCartTotals'
import { MenuBrowser } from '../components/MenuBrowser'
import { TotalsBlock } from '../components/OrderBits'
import { OrderTypeSelector, OrderTypeDetails } from '../components/OrderTypeOptions'

export default function OrderOnlinePage() {
  useDocumentTitle('Order Online')
  const orderType = useCartStore((s) => s.orderType)
  const setOrderType = useCartStore((s) => s.setOrderType)

  return (
    <>
      <PageHero eyebrow="Order Online" cjk="外賣" title={'Order From *Our* Kitchen'} subtitle="Dine-in, takeaway or delivery — hot from the wok, exactly when you want it." image="hakkaDark" />

      <section className="container-x relative -mt-6 pb-28">
        <Reveal className="rounded-3xl border border-line bg-surface/80 p-5 backdrop-blur-xl sm:p-7">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-2xl">Choose your order type</h2>
            <span className="hidden text-sm text-muted sm:block">Step 1 of 3</span>
          </div>
          <OrderTypeSelector value={orderType === 'room-service' ? 'delivery' : orderType} onChange={setOrderType} />
          <OrderTypeDetails type={orderType} />
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <h2 className="mb-5 font-display text-3xl">Menu</h2>
            <MenuBrowser compact defaultLayout="grid" stickyTop="top-20" />
          </div>
          <CartPanel />
        </div>
      </section>
      <MobileCartBar />
    </>
  )
}

function CartPanel() {
  const { lines, totals } = useCartTotals()
  const setQty = useCartStore((s) => s.setQty)
  const navigate = useNavigate()
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 rounded-3xl border border-line bg-surface/80 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl">Your Order</h3>
          <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-muted">{totals.itemCount} items</span>
        </div>
        <div className="scrollbar-thin mt-4 max-h-[42vh] space-y-2 overflow-y-auto pr-1" data-lenis-prevent>
          <AnimatePresence initial={false}>
            {lines.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid place-items-center rounded-2xl border border-dashed border-line-strong py-10 text-center text-sm text-muted">
                <ShoppingBag className="mb-2 size-6 text-gold-400" />
                Add dishes to start your order
              </motion.div>
            )}
            {lines.map((l) => (
              <motion.div key={l.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }} className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-surface-2/60">
                <SmartImage src={img(l.image, { w: 100, h: 100 })} alt="" className="size-11 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{l.name}</div>
                  <div className="text-xs text-muted">{formatMoney(l.price * l.qty)}</div>
                </div>
                <QuantityStepper size="sm" value={l.qty} onChange={(q) => setQty(l, q)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <TotalsBlock totals={totals} className="mt-5 border-t border-line pt-4" />
        <Button className="mt-5 w-full" size="lg" disabled={!lines.length} iconRight={ArrowRight} onClick={() => navigate('/checkout')}>
          Proceed to Checkout
        </Button>
      </div>
    </aside>
  )
}

function MobileCartBar() {
  const { totals } = useCartTotals()
  const open = useCartStore((s) => s.open)
  return (
    <AnimatePresence>
      {totals.itemCount > 0 && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
          <button onClick={open} className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-lacquer-500 to-lacquer-600 px-5 py-4 text-white shadow-2xl shadow-lacquer-500/40">
            <span className="flex items-center gap-2 font-semibold">
              <ShoppingBag className="size-5" /> {totals.itemCount} items
            </span>
            <span className="flex items-center gap-2 font-bold">
              {formatMoney(totals.total)} <ArrowRight className="size-4" />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
