import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SmoothScroll } from '@/core/animation/SmoothScroll'
import { ScrollProgress, CursorGlow } from '@/core/animation/effects'
import { useApplyTheme } from '@/core/theme/theme.store'
import { Emblem } from '@/core/ui'
import { CartDrawer } from '@/modules/ordering'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { Preloader } from './Preloader'

/** Public website chrome: smooth scrolling, nav, cart drawer, footer. Always dark-luxe. */
export function WebsiteLayout() {
  useApplyTheme('dark')
  const { pathname } = useLocation()
  return (
    <SmoothScroll>
      <Preloader />
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main className="min-h-dvh overflow-x-clip">
        <Suspense fallback={<RouteFallback />}>
          <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Outlet />
          </motion.div>
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </SmoothScroll>
  )
}

function RouteFallback() {
  return (
    <div className="grid min-h-dvh place-items-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}>
        <Emblem className="size-14" />
      </motion.div>
    </div>
  )
}
