import { createContext, useContext, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { frame, cancelFrame } from 'framer-motion'

const LenisContext = createContext(null)
export const useLenis = () => useContext(LenisContext)

/**
 * Buttery inertia scrolling (Lenis) driven by framer-motion's frame loop so
 * scroll-linked animations (useScroll) and Lenis stay perfectly in step.
 */
export function SmoothScroll({ children, enabled = true }) {
  const lenisRef = useRef(null)
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.95 })
    lenisRef.current = lenis
    window.__lenis = lenis
    const update = ({ timestamp }) => lenis.raf(timestamp)
    frame.update(update, true)
    return () => {
      cancelFrame(update)
      lenis.destroy()
      lenisRef.current = null
      window.__lenis = undefined
    }
  }, [enabled])

  // Scroll restoration on navigation
  useEffect(() => {
    const target = hash ? document.querySelector(hash) : null
    if (target) {
      lenisRef.current ? lenisRef.current.scrollTo(target, { offset: -90 }) : target.scrollIntoView()
    } else {
      lenisRef.current ? lenisRef.current.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
}

/** Scroll helper that works with or without Lenis. */
export function scrollToTarget(target, offset = -90) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  if (window.__lenis) window.__lenis.scrollTo(el, { offset })
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' })
}
