import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Utensils, ShoppingBag, Bike, Hotel, ArrowDown, Star } from 'lucide-react'
import { Button } from '@/core/ui'
import { SplitText } from '@/core/animation/SplitText'
import { Magnetic } from '@/core/animation/effects'
import { img } from '@/core/lib/image'
import { Lantern, Steam } from '../components/Ornaments'

const SERVICES = [
  { label: 'Dine-In', icon: Utensils },
  { label: 'Takeaway', icon: ShoppingBag },
  { label: 'Delivery', icon: Bike },
  { label: 'Hotel Dining', icon: Hotel },
]

export function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const gateScale = useTransform(scrollYProgress, [0, 1], [1, 1.45])
  const gateY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 120])

  return (
    <section ref={ref} className="grain relative min-h-[100svh] overflow-hidden">
      {/* atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_40%,rgba(196,30,58,0.32),transparent_60%),radial-gradient(ellipse_50%_40%_at_10%_90%,rgba(208,154,69,0.14),transparent_60%)]" />
      <div className="pattern-lattice absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,#000,transparent_70%)]" />
      <Lantern className="absolute left-[44%] top-20 hidden lg:block" size={46} />
      <Lantern className="absolute right-[7%] top-20 hidden sm:block" size={38} delay={1.4} />

      <div className="container-x relative grid min-h-[100svh] items-center gap-10 pb-16 pt-32 lg:grid-cols-[1.05fr_1fr]">
        <motion.div style={{ y: textY, opacity: fade }} className="relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="mb-7 inline-flex items-center gap-3 rounded-full border border-gold-400/30 bg-gold-400/5 py-1.5 pl-1.5 pr-4 text-xs text-gold-200">
            <span className="rounded-full bg-lacquer-500 px-2.5 py-1 font-bold uppercase tracking-wider text-white">New</span>
            Weekend Chinese Feast · 20% off
          </motion.div>
          <SplitText as="h1" delay={0.3} text={'Authentic Chinese\n*Flavours,* Crafted\nfor You'} className="font-display text-[clamp(3rem,6.6vw,5.9rem)] font-medium leading-[0.92] tracking-[-0.03em] text-pearl-50" />
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.9 }} className="mt-7 max-w-lg text-lg leading-relaxed text-pearl-200/75">
            Experience authentic Chinese cuisine prepared with premium ingredients, traditional techniques, and a modern touch.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.9 }} className="mt-9 flex flex-wrap gap-3">
            <Magnetic><Button to="/reservations" size="lg">Reserve a Table</Button></Magnetic>
            <Magnetic><Button to="/order" size="lg" variant="outline">Order Online</Button></Magnetic>
          </motion.div>
          <motion.ul initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 1.5 } } }} className="mt-12 flex flex-wrap gap-2.5">
            {SERVICES.map((s) => (
              <motion.li key={s.label} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="flex items-center gap-2 rounded-full border border-line bg-surface/40 px-4 py-2 text-sm text-pearl-200 backdrop-blur">
                <s.icon className="size-4 text-gold-400" />
                {s.label}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Moon gate */}
        <motion.div style={{ scale: gateScale, y: gateY }} className="relative mx-auto aspect-square w-full max-w-[560px]">
          <motion.div style={{ rotate: ringRotate }} className="absolute -inset-6 rounded-full border border-dashed border-gold-400/35" />
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }} className="absolute inset-0 overflow-hidden rounded-full border-[6px] border-gold-500/40 shadow-[0_0_120px_-20px] shadow-lacquer-500/60">
            <img src={img('dimsum', { w: 1200, h: 1200, q: 80 })} alt="Bamboo steamers of dim sum" className="size-full scale-110 object-cover" fetchPriority="high" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
          </motion.div>
          <Steam className="absolute left-1/2 top-[18%] -translate-x-1/2" />
          {/* floating plates */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1, duration: 1 }} className="absolute -right-2 top-[8%] size-28 animate-float overflow-hidden rounded-full border-4 border-ink-900 shadow-2xl sm:size-36">
            <img src={img('chilliChicken', { w: 300, h: 300 })} alt="" className="size-full object-cover" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3, duration: 1 }} className="absolute -left-4 bottom-[12%] size-24 overflow-hidden rounded-full border-4 border-ink-900 shadow-2xl [animation:float_7s_ease-in-out_infinite] sm:size-32">
            <img src={img('hakka', { w: 300, h: 300 })} alt="" className="size-full object-cover" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }} className="glass absolute bottom-[2%] right-[6%] flex items-center gap-3 rounded-2xl border border-line px-4 py-3">
            <div className="flex">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="size-3.5 fill-gold-400 text-gold-400" />)}</div>
            <div className="text-xs leading-tight"><b className="text-pearl-50">4.9</b> <span className="text-muted">· 2,400+ reviews</span></div>
          </motion.div>
          <span className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none font-cjk text-[9rem] leading-none text-gold-300/[0.07]">龍珠</span>
        </motion.div>
      </div>

      <div className="absolute inset-y-0 right-4 hidden flex-col items-center justify-center gap-4 xl:flex">
        <span className="h-20 w-px bg-gradient-to-b from-transparent to-gold-400/50" />
        <span className="font-cjk text-sm tracking-[0.6em] text-gold-400/70 [writing-mode:vertical-rl]">正宗中菜 · 匠心之作</span>
        <span className="h-20 w-px bg-gradient-to-t from-transparent to-gold-400/50" />
      </div>

      <motion.div style={{ opacity: fade }} className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
        Scroll
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}><ArrowDown className="size-4 text-gold-400" /></motion.span>
      </motion.div>
    </section>
  )
}
