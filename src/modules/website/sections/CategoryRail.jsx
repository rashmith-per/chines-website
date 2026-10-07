import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Eyebrow } from '@/core/ui'
import { img } from '@/core/lib/image'
import { useMediaQuery } from '@/core/hooks'
import { CATEGORIES } from '@/modules/catalog'

/**
 * "Explore Our Menu" — a pinned section that converts vertical scroll into a
 * horizontal journey through the nine categories (falls back to swipe on mobile).
 */
export function CategoryRail() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  return isDesktop ? <PinnedRail /> : <SwipeRail />
}

function Intro() {
  return (
    <div className="shrink-0 lg:w-[34vw] lg:pr-12">
      <Eyebrow cjk="菜單">Featured Categories</Eyebrow>
      <h2 className="mt-5 font-display text-5xl leading-[0.95] tracking-tight md:text-6xl">Explore <span className="italic text-gradient-gold">Our Menu</span></h2>
      <p className="mt-5 max-w-sm text-muted">Nine chapters of Chinese cooking — from Cantonese dim sum baskets to fiery Sichuan woks.</p>
    </div>
  )
}

function CategoryCard({ c, i }) {
  return (
    <Link to={`/menu?cat=${c.id}`} className="group relative block h-[62vh] max-h-[560px] w-[min(78vw,340px)] shrink-0 overflow-hidden rounded-[2rem] border border-line">
      <img src={img(c.image, { w: 700, h: 1000 })} alt={c.name} loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-ink-950/10" />
      <span className="absolute right-5 top-4 font-display text-sm italic text-pearl-200/70">{String(i + 1).padStart(2, '0')}</span>
      <span className="absolute left-5 top-3 font-cjk text-7xl font-black text-gold-300/25 transition-all duration-700 group-hover:text-gold-300/60">{c.cjk}</span>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="font-display text-3xl text-pearl-50">{c.name}</h3>
        <p className="mt-1 text-sm text-pearl-200/70">{c.blurb}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300">
          Explore <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
        </span>
      </div>
    </Link>
  )
}

function PinnedRail() {
  const section = useRef(null)
  const track = useRef(null)
  const [distance, setDistance] = useState(0)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  const x = useTransform(smooth, [0, 1], [0, -distance])
  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useLayoutEffect(() => {
    const measure = () => setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth + 64))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <section ref={section} className="relative" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex items-center gap-6 pl-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))]">
          <Intro />
          {CATEGORIES.map((c, i) => <CategoryCard key={c.id} c={c} i={i} />)}
          <div className="w-10 shrink-0" />
        </motion.div>
        <div className="container-x mt-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-line"><motion.div style={{ width: progress }} className="h-px bg-gradient-to-r from-gold-400 to-lacquer-500" /></div>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">Scroll to explore</span>
        </div>
      </div>
    </section>
  )
}

function SwipeRail() {
  return (
    <section className="py-20">
      <div className="container-x"><Intro /></div>
      <div className="scrollbar-none mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4" data-lenis-prevent-wheel>
        {CATEGORIES.map((c, i) => (
          <motion.div key={c.id} className="snap-start" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <CategoryCard c={c} i={i} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
