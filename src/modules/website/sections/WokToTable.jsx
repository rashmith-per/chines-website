import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { Eyebrow } from '@/core/ui'
import { img } from '@/core/lib/image'
import { cn } from '@/core/lib/cn'
import { Steam } from '../components/Ornaments'

const CHAPTERS = [
  { n: '01', cjk: '選', title: 'Sourced at dawn', body: 'Telangana greens, coastal prawns and spices imported from Sichuan — chosen every morning by Chef Wong himself.', image: 'vegBowl', stat: '42', statLabel: 'trusted farms & suppliers' },
  { n: '02', cjk: '包', title: 'Folded by hand', body: 'Every har gow carries at least seven pleats. Our dim sum team folds over 1,800 dumplings before the first lunch guest arrives.', image: 'dumpling', stat: '1,800', statLabel: 'dumplings folded daily' },
  { n: '03', cjk: '火', title: 'Kissed by wok hei', body: 'Carbon-steel woks over 650°C jet flames give noodles and rice the smoky “breath of the wok” you can taste but never fake.', image: 'chilliNoodles', stat: '650°', statLabel: 'flame temperature' },
  { n: '04', cjk: '宴', title: 'Served as a feast', body: 'At your table, in your room or at your door — plated with the same care, timed to arrive at its peak.', image: 'tableSpread', stat: '25', statLabel: 'minutes, wok to door' },
]

/** Scrollytelling: a sticky stage whose story advances chapter by chapter as you scroll. */
export function WokToTable() {
  const ref = useRef(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.15, 1])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.min(CHAPTERS.length - 1, Math.floor(v * CHAPTERS.length)))
  })

  const ch = CHAPTERS[active]

  return (
    <section ref={ref} className="relative" style={{ height: `${CHAPTERS.length * 90 + 20}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(196,30,58,0.18),transparent_55%)]" />
        <div className="container-x relative grid w-full items-center gap-10 lg:grid-cols-[auto_1fr_1.1fr]">
          {/* progress rail */}
          <div className="relative hidden h-[52vh] w-px bg-line lg:block">
            <motion.div style={{ height: progressHeight }} className="absolute left-0 top-0 w-px bg-gradient-to-b from-gold-300 to-lacquer-500" />
            {CHAPTERS.map((c, i) => (
              <div key={c.n} className="absolute -left-[5px] flex items-center gap-3" style={{ top: `${(i / (CHAPTERS.length - 1)) * 100}%` }}>
                <span className={cn('size-[11px] rounded-full border-2 transition-all duration-500', i <= active ? 'border-gold-300 bg-gold-400 shadow-[0_0_12px] shadow-gold-400' : 'border-line-strong bg-bg')} />
              </div>
            ))}
          </div>

          <div className="relative min-h-[46vh]">
            <Eyebrow cjk="由鍋到桌">From Wok to Table</Eyebrow>
            <AnimatePresence mode="wait">
              <motion.div key={ch.n} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mt-8">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-7xl font-light italic text-gold-400/70 md:text-8xl">{ch.n}</span>
                  <span className="font-cjk text-5xl text-lacquer-400/80">{ch.cjk}</span>
                </div>
                <h2 className="mt-4 font-display text-4xl leading-tight md:text-6xl">{ch.title}</h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">{ch.body}</p>
                <div className="mt-8 flex items-end gap-3">
                  <span className="font-display text-5xl font-semibold text-gradient-gold">{ch.stat}</span>
                  <span className="pb-2 text-sm text-muted">{ch.statLabel}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative mx-auto hidden aspect-[4/5] w-full max-w-[520px] sm:block">
            <motion.div style={{ scale: imageScale }} className="absolute inset-0 overflow-hidden rounded-[2.5rem] border border-line">
              <AnimatePresence initial={false}>
                <motion.img key={ch.image} src={img(ch.image, { w: 1000, h: 1250 })} alt={ch.title} initial={{ opacity: 0, scale: 1.12, clipPath: 'inset(100% 0 0 0)' }} animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0 0 0)' }} exit={{ opacity: 0 }} transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }} className="absolute inset-0 size-full object-cover" />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
            </motion.div>
            {active === 2 && <Steam className="absolute left-1/2 top-6 -translate-x-1/2" />}
            <div className="glass absolute -bottom-5 -left-5 rounded-2xl border border-line px-5 py-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted">Chapter</div>
              <div className="font-display text-2xl">{active + 1} <span className="text-muted">/ {CHAPTERS.length}</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
