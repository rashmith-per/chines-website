import { useEffect, useRef, useState, useCallback } from 'react'

export function useMediaQuery(query) {
  const get = () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false)
  const [matches, setMatches] = useState(get)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    onChange()
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/** Re-renders every `ms` and returns the current timestamp (timers, live clocks). */
export function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms)
    return () => clearInterval(t)
  }, [ms])
  return now
}

export function useInterval(callback, delay) {
  const saved = useRef(callback)
  useEffect(() => {
    saved.current = callback
  }, [callback])
  useEffect(() => {
    if (delay == null) return
    const t = setInterval(() => saved.current(), delay)
    return () => clearInterval(t)
  }, [delay])
}

export function useDisclosure(initial = false) {
  const [isOpen, setOpen] = useState(initial)
  const open = useCallback(() => setOpen(true), [])
  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((v) => !v), [])
  return { isOpen, open, close, toggle, setOpen }
}

export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    window.__lenis?.stop()
    return () => {
      document.documentElement.style.overflow = prev
      window.__lenis?.start()
    }
  }, [locked])
}

export function useKey(key, handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const onKey = (e) => e.key === key && handler(e)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [key, handler, enabled])
}

export function useDocumentTitle(title) {
  useEffect(() => {
    if (title) document.title = `${title} · Dragon Pearl`
  }, [title])
}
