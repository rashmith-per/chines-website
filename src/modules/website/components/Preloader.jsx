import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const KEY = 'dp-intro-seen'
const seen = () => {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

/** First-visit brand intro: ink ring draws, 龍 rises, lacquer curtain lifts. */
export function Preloader() {
  const [show, setShow] = useState(() => !seen())
  useEffect(() => {
    if (!show) return
    const t = setTimeout(() => {
      setShow(false)
      try {
        sessionStorage.setItem(KEY, '1')
      } catch {
        /* storage unavailable */
      }
    }, 2100)
    return () => clearTimeout(t)
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-ink-950" exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}>
          <div className="relative grid place-items-center">
            <svg viewBox="0 0 200 200" className="size-56">
              <motion.circle cx="100" cy="100" r="90" fill="none" stroke="url(#pl)" strokeWidth="1.5" initial={{ pathLength: 0, rotate: -90 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }} style={{ originX: '50%', originY: '50%' }} />
              <defs>
                <linearGradient id="pl"><stop offset="0" stopColor="#f3dfb3" /><stop offset="1" stopColor="#a97a2f" /></linearGradient>
              </defs>
            </svg>
            <motion.span initial={{ y: 30, opacity: 0, filter: 'blur(12px)' }} animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }} transition={{ delay: 0.3, duration: 1.1, ease: [0.22, 1, 0.36, 1] }} className="absolute font-cjk text-8xl font-black text-gradient-gold">
              龍
            </motion.span>
          </div>
          <motion.div initial={{ opacity: 0, letterSpacing: '0.1em' }} animate={{ opacity: 1, letterSpacing: '0.5em' }} transition={{ delay: 0.8, duration: 1.2 }} className="absolute bottom-[22%] text-xs font-semibold uppercase text-pearl-300">
            Dragon Pearl
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
