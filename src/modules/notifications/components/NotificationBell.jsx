import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Bell, CheckCheck } from 'lucide-react'
import { cn } from '@/core/lib/cn'
import { timeAgo } from '@/core/lib/format'
import { useNotificationsStore } from '../store/notifications.store'
import { KIND_ICON } from './icons'

/** Topbar bell with unread badge + dropdown feed (restaurant audience). */
export function NotificationBell() {
  const items = useNotificationsStore((s) => s.items)
  const markAllRead = useNotificationsStore((s) => s.markAllRead)
  const markRead = useNotificationsStore((s) => s.markRead)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const feed = items.filter((n) => n.audience === 'restaurant')
  const unread = feed.filter((n) => !n.read).length

  useEffect(() => {
    if (!open) return
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false)
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} className="relative grid size-10 place-items-center rounded-xl text-muted transition hover:bg-surface-2 hover:text-fg" aria-label="Notifications">
        <Bell className={cn('size-5', unread && 'animate-sway')} />
        {unread > 0 && (
          <motion.span key={unread} initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-1 top-1 grid min-w-4.5 place-items-center rounded-full bg-lacquer-500 px-1 text-[10px] font-bold text-white">
            {unread}
          </motion.span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }} transition={{ duration: 0.18 }}
            className="absolute right-0 top-12 z-50 w-[22rem] overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="font-semibold">Notifications</span>
              <button onClick={() => markAllRead('restaurant')} className="flex items-center gap-1 text-xs font-semibold text-gold-600 hover:underline dark:text-gold-300"><CheckCheck className="size-3.5" /> Mark all read</button>
            </div>
            <div className="scrollbar-thin max-h-96 overflow-y-auto">
              {feed.slice(0, 8).map((n) => {
                const Icon = KIND_ICON[n.kind] ?? Bell
                return (
                  <button key={n.id} onClick={() => markRead(n.id)} className={cn('flex w-full gap-3 border-b border-line px-4 py-3 text-left transition hover:bg-surface-2/60', !n.read && 'bg-gold-400/5')}>
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-gold-600 dark:text-gold-300"><Icon className="size-4" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2 text-sm font-semibold">{n.title}<span className="text-[10px] font-normal text-muted">{timeAgo(n.at)}</span></span>
                      <span className="line-clamp-2 text-xs text-muted">{n.body}</span>
                    </span>
                    {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-lacquer-500" />}
                  </button>
                )
              })}
            </div>
            <Link to="/admin/notifications" onClick={() => setOpen(false)} className="block px-4 py-3 text-center text-sm font-semibold text-gold-600 hover:bg-surface-2 dark:text-gold-300">View all</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
