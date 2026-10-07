import { motion } from 'framer-motion'
import { Button } from '@/core/ui'
import { useDocumentTitle } from '@/core/hooks'

export default function NotFoundPage() {
  useDocumentTitle('Page not found')
  return (
    <div className="grid min-h-dvh place-items-center bg-bg px-6 text-center text-fg">
      <div>
        <motion.div initial={{ scale: 0.5, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 14 }} className="font-cjk text-[10rem] leading-none text-gradient-gold">迷</motion.div>
        <h1 className="mt-4 font-display text-5xl">Lost in the kitchen</h1>
        <p className="mx-auto mt-3 max-w-sm text-muted">This page wandered off like a runaway dumpling. Let’s get you back to the good stuff.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button to="/">Back home</Button>
          <Button to="/menu" variant="outline">See the menu</Button>
        </div>
      </div>
    </div>
  )
}
