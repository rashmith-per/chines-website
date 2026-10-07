import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/core/lib/cn'
import { useKey, useLockBodyScroll } from '@/core/hooks'

function Backdrop({ onClose }) {
  return (
    <motion.div
      className="fixed inset-0 bg-ink-950/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    />
  )
}

/** Centered dialog. */
export function Modal({ open, onClose, title, description, children, footer, size = 'md', className }) {
  useLockBodyScroll(open)
  useKey('Escape', onClose, open)
  const width = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' }[size]
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6" data-lenis-prevent>
          <Backdrop onClose={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            className={cn('relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-line bg-surface shadow-2xl sm:rounded-3xl', width, className)}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            {(title || description) && (
              <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
                <div>
                  <h3 className="font-display text-2xl leading-tight">{title}</h3>
                  {description && <p className="mt-1 text-sm text-muted">{description}</p>}
                </div>
                <button onClick={onClose} className="grid size-9 shrink-0 place-items-center rounded-xl text-muted hover:bg-surface-2 hover:text-fg" aria-label="Close">
                  <X className="size-4.5" />
                </button>
              </div>
            )}
            <div className="scrollbar-thin flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line bg-surface-2/40 px-6 py-4">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

/** Side sheet. */
export function Drawer({ open, onClose, title, subtitle, children, footer, side = 'right', width = 'max-w-md', className }) {
  useLockBodyScroll(open)
  useKey('Escape', onClose, open)
  const from = side === 'right' ? '100%' : '-100%'
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90]" data-lenis-prevent>
          <Backdrop onClose={onClose} />
          <motion.aside
            className={cn('absolute inset-y-0 flex w-full flex-col border-line bg-surface shadow-2xl', side === 'right' ? 'right-0 border-l' : 'left-0 border-r', width, className)}
            initial={{ x: from }}
            animate={{ x: 0 }}
            exit={{ x: from }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
          >
            {title && (
              <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-5">
                <div>
                  <h3 className="font-display text-2xl leading-tight">{title}</h3>
                  {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
                </div>
                <button onClick={onClose} className="grid size-9 place-items-center rounded-xl text-muted hover:bg-surface-2 hover:text-fg" aria-label="Close">
                  <X className="size-4.5" />
                </button>
              </div>
            )}
            <div className="scrollbar-thin flex-1 overflow-y-auto">{children}</div>
            {footer && <div className="border-t border-line bg-surface-2/40 px-6 py-4">{footer}</div>}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
