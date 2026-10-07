import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, CornerDownLeft } from 'lucide-react'
import { cn } from '@/core/lib/cn'
import { Kbd } from '@/core/ui'

/** ⌘K / Ctrl+K quick navigator across every back-office module the user can access. */
export function CommandPalette({ open, onClose, items }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [index, setIndex] = useState(0)
  const results = useMemo(() => items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()) || i.group.toLowerCase().includes(q.toLowerCase())), [items, q])

  useEffect(() => {
    if (open) {
      setQ('')
      setIndex(0)
    }
  }, [open])

  const go = (item) => {
    navigate(item.path)
    onClose()
  }

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((i) => Math.min(results.length - 1, i + 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((i) => Math.max(0, i - 1)) }
    if (e.key === 'Enter' && results[index]) go(results[index])
    if (e.key === 'Escape') onClose()
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[95] flex items-start justify-center p-4 pt-[14vh]">
          <motion.div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="size-4 text-muted" />
              <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setIndex(0) }} onKeyDown={onKey} placeholder="Search modules…" className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-muted" />
              <Kbd>Esc</Kbd>
            </div>
            <div className="scrollbar-thin max-h-80 overflow-y-auto p-2">
              {results.map((item, i) => (
                <button key={item.path} onMouseEnter={() => setIndex(i)} onClick={() => go(item)} className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm', i === index ? 'bg-gold-400/12 text-fg' : 'text-muted')}>
                  <item.icon className="size-4" />
                  <span className="flex-1 font-medium">{item.label}</span>
                  <span className="text-xs text-muted">{item.group}</span>
                  {i === index && <CornerDownLeft className="size-3.5" />}
                </button>
              ))}
              {!results.length && <div className="py-8 text-center text-sm text-muted">No matches</div>}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
