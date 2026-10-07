import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { img } from '@/core/lib/image'
import { SplitText } from '@/core/animation/SplitText'
import { Eyebrow } from './Brand'

/** Parallax banner used at the top of inner website pages. */
export function PageHero({ eyebrow, cjk, title, subtitle, image = 'interiorDark', children }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="grain relative flex min-h-[62vh] items-end overflow-hidden pb-16 pt-36">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img src={img(image, { w: 1920, q: 70 })} alt="" className="size-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/60 to-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(196,30,58,0.25),transparent_55%)]" />
      {cjk && (
        <span className="text-outline pointer-events-none absolute -right-6 top-24 select-none font-cjk text-[28vw] leading-none opacity-40 md:text-[18vw]">{cjk}</span>
      )}
      <motion.div style={{ opacity }} className="container-x relative">
        {eyebrow && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <Eyebrow cjk={cjk}>{eyebrow}</Eyebrow>
          </motion.div>
        )}
        <SplitText as="h1" text={title} className="mt-5 max-w-4xl font-display text-5xl font-medium leading-[0.95] tracking-tight text-pearl-50 md:text-7xl" />
        {subtitle && (
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="mt-6 max-w-xl text-lg text-pearl-200/80">
            {subtitle}
          </motion.p>
        )}
        {children}
      </motion.div>
    </section>
  )
}
