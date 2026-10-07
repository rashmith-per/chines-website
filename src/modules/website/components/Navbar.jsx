import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, X, UserRound, ArrowUpRight } from 'lucide-react'
import { Logo, Button } from '@/core/ui'
import { cn } from '@/core/lib/cn'
import { APP_CONFIG } from '@/core/config/app.config'
import { useLockBodyScroll } from '@/core/hooks'
import { CartButton } from '@/modules/ordering'

export const NAV_LINKS = [
  { to: '/', label: 'Home', cjk: '首頁' },
  { to: '/menu', label: 'Menu', cjk: '菜單' },
  { to: '/about', label: 'About Us', cjk: '關於' },
  { to: '/reservations', label: 'Reservations', cjk: '訂位' },
  { to: '/order', label: 'Order Online', cjk: '外賣' },
  { to: '/offers', label: 'Offers', cjk: '優惠' },
  { to: '/contact', label: 'Contact', cjk: '聯繫' },
]

export function Navbar() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useLockBodyScroll(open)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 40)
    setHidden(y > 400 && y > prev && !open)
  })
  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      <motion.header
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3"
      >
        <div className={cn('container-x flex h-16 items-center gap-6 rounded-2xl border transition-all duration-500', scrolled ? 'glass border-line shadow-2xl shadow-black/30' : 'border-transparent')}>
          <Logo />
          <nav className="ml-auto hidden items-center gap-1 xl:flex">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => cn('relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors', isActive ? 'text-gold-300' : 'text-pearl-200/80 hover:text-pearl-50')}>
                {({ isActive }) => (
                  <>
                    {isActive && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full border border-gold-400/30 bg-gold-400/10" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                    <span className="relative">{l.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 xl:ml-2">
            <Button to="/reservations" variant="outline" size="sm" className="max-md:hidden">Book a Table</Button>
            <Button to="/order" size="sm" className="max-sm:hidden">Order Now</Button>
            <Link to="/account" className="hidden size-11 place-items-center rounded-xl border border-line text-fg transition hover:border-gold-400/50 hover:text-gold-300 sm:grid" aria-label="My account"><UserRound className="size-5" /></Link>
            <CartButton />
            <button onClick={() => setOpen(true)} className="grid size-11 place-items-center rounded-xl border border-line xl:hidden" aria-label="Open menu"><Menu className="size-5" /></button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[60] overflow-y-auto bg-ink-950" initial={{ clipPath: 'circle(0% at 100% 0%)' }} animate={{ clipPath: 'circle(150% at 100% 0%)' }} exit={{ clipPath: 'circle(0% at 100% 0%)' }} transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }} data-lenis-prevent>
            <div className="pattern-lattice absolute inset-0 opacity-30" />
            <div className="container-x relative flex min-h-full flex-col py-6">
              <div className="flex items-center justify-between">
                <Logo />
                <button onClick={() => setOpen(false)} className="grid size-11 place-items-center rounded-xl border border-line" aria-label="Close menu"><X className="size-5" /></button>
              </div>
              <nav className="my-auto py-10">
                {NAV_LINKS.map((l, i) => (
                  <motion.div key={l.to} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                    <Link to={l.to} className="group flex items-baseline gap-4 border-b border-line py-3">
                      <span className="font-cjk text-sm text-gold-400/70">{l.cjk}</span>
                      <span className="font-display text-4xl transition-colors group-hover:text-gold-300 sm:text-5xl">{l.label}</span>
                      <ArrowUpRight className="ml-auto size-6 text-muted transition group-hover:rotate-45 group-hover:text-gold-300" />
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="grid grid-cols-2 gap-3">
                <Button to="/reservations" variant="outline">Book a Table</Button>
                <Button to="/order">Order Now</Button>
              </div>
              <p className="mt-6 text-center text-sm text-muted">{APP_CONFIG.brand.phone} · {APP_CONFIG.brand.address.line1}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
