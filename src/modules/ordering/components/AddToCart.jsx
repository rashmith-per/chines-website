import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { QuantityStepper } from '@/core/ui'
import { cn } from '@/core/lib/cn'
import { useCartStore } from '../store/cart.store'

/** "Add" button that morphs into a − qty + stepper once the dish is in the cart. */
export function AddToCart({ dish, size = 'md', label = 'Add', className }) {
  const qty = useCartStore((s) => s.lines.find((l) => l.id === dish.id)?.qty ?? 0)
  const add = useCartStore((s) => s.add)
  const setQty = useCartStore((s) => s.setQty)

  const onAdd = () => {
    add(dish)
    toast.success(`${dish.name} added`, { description: 'Your order is waiting in the cart.', duration: 1800 })
  }

  return (
    <div className={cn('relative', className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        {qty === 0 ? (
          <motion.button
            key="add"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileTap={{ scale: 0.92 }}
            onClick={onAdd}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-xl border border-gold-400/40 bg-gold-400/10 font-bold text-gold-300 transition-colors hover:bg-gold-400 hover:text-ink-950',
              size === 'sm' ? 'h-8 px-3 text-xs' : 'h-10 px-4 text-sm',
            )}
          >
            <Plus className="size-4" />
            {label}
          </motion.button>
        ) : (
          <motion.div key="qty" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
            <QuantityStepper value={qty} onChange={(q) => setQty(dish, q)} size={size} className="border-gold-400/40 bg-gold-400/10 text-gold-200" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
