import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Award, Leaf, Flame, HeartHandshake } from 'lucide-react'
import { PageHero, Eyebrow, Button } from '@/core/ui'
import { Reveal, RevealGroup, RevealItem } from '@/core/animation/Reveal'
import { SplitText, ScrollHighlightText } from '@/core/animation/SplitText'
import { Marquee, Parallax } from '@/core/animation/effects'
import { img } from '@/core/lib/image'
import { useDocumentTitle } from '@/core/hooks'
import { CloudDivider } from '../components/Ornaments'

const TIMELINE = [
  { year: '2009', title: 'A wok and a dream', body: 'Chef Wong Lei arrives in Hyderabad from Guangzhou with a carbon-steel wok and his grandmother’s dim sum recipes.' },
  { year: '2013', title: 'Dragon Pearl opens', body: 'A 40-cover dining room opens on the ground floor of The Grand Meridian — and sells out its first weekend.' },
  { year: '2017', title: 'The Sichuan room', body: 'We add a dedicated Sichuan kitchen and import peppercorns directly from Hanyuan county.' },
  { year: '2021', title: 'From our wok to your door', body: 'Online ordering, takeaway and in-room dining bring Dragon Pearl to every guest of the hotel and the city.' },
  { year: '2026', title: 'The next chapter', body: 'A redesigned dining room, private dining for 12, and a smart kitchen that times every dish to perfection.' },
]

const VALUES = [
  { icon: Leaf, title: 'Honest ingredients', body: 'No MSG shortcuts. Fresh produce every morning and sauces made in-house.' },
  { icon: Flame, title: 'Real wok hei', body: 'Jet-flame woks at 650°C for that smoky breath only a true wok can give.' },
  { icon: Award, title: 'Award-winning', body: 'Times Food Awards — Best Chinese, Hyderabad, four years running.' },
  { icon: HeartHandshake, title: 'Warm hospitality', body: 'Hotel-grade service whether you dine in, take away or order to your room.' },
]

export default function AboutPage() {
  useDocumentTitle('About Us')
  return (
    <>
      <PageHero eyebrow="Our Story" cjk="故事" title={'Fifteen years of *fire*'} subtitle="From a single wok in 2009 to Hyderabad’s most loved Chinese dining room." image="chefPlating" />

      <section className="container-x py-24">
        <div className="mx-auto max-w-4xl text-center">
          <CloudDivider className="mx-auto" />
          <ScrollHighlightText className="mt-10 justify-center font-display text-3xl leading-snug md:text-5xl" text="We believe Chinese food is about *balance* — sweet and sour, heat and calm, the crisp and the silken. Every plate we send out is a small act of *harmony.*" />
        </div>
      </section>

      <Timeline />

      <section className="container-x grid items-center gap-14 py-28 lg:grid-cols-2">
        <div className="relative">
          <div className="overflow-hidden rounded-[2.5rem] border border-line">
            <Parallax speed={0.3} className="-my-12">
              <img src={img('headChef', { w: 1000, h: 1300 })} alt="Head chef Wong Lei" className="aspect-[4/5] w-full object-cover" />
            </Parallax>
          </div>
          <div className="glass absolute -bottom-6 -right-4 rounded-2xl border border-line px-6 py-4 md:-right-10">
            <div className="font-cjk text-2xl text-gold-300">黃磊</div>
            <div className="font-display text-xl">Chef Wong Lei</div>
            <div className="text-xs text-muted">Executive Chef · Guangzhou</div>
          </div>
        </div>
        <div>
          <Eyebrow cjk="主廚">Meet the Chef</Eyebrow>
          <SplitText text={'Cooking is *memory* made edible.'} className="mt-5 font-display text-5xl leading-[0.95] tracking-tight md:text-6xl" />
          <Reveal>
            <p className="mt-6 text-lg leading-relaxed text-muted">Trained in the dim sum houses of Guangzhou and the fiery kitchens of Chengdu, Chef Wong leads a brigade of 14 cooks. His menu respects tradition but is never afraid of a modern touch — a chilli-oil wonton here, a truffle dumpling there.</p>
            <p className="mt-4 text-lg leading-relaxed text-muted">“Wok hei cannot be rushed, and it cannot be faked. It is the breath of the wok — the soul of the dish.”</p>
            <Button to="/reservations" className="mt-8">Taste it tonight</Button>
          </Reveal>
        </div>
      </section>

      <section className="container-x pb-24">
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <RevealItem key={v.title} className="group rounded-[2rem] border border-line bg-surface/60 p-7 transition-colors hover:border-gold-400/40">
              <span className="grid size-12 place-items-center rounded-2xl bg-gold-400/10 text-gold-300 transition-transform duration-500 group-hover:rotate-12"><v.icon className="size-6" /></span>
              <h3 className="mt-5 font-display text-2xl">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{v.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="pb-28">
        <Marquee duration={50}>
          {['interiorWarm', 'dimsum', 'bar', 'tableSpread', 'interiorBright', 'prawnNoodles', 'fineDining', 'teapot'].map((k) => (
            <img key={k} src={img(k, { w: 600, h: 420 })} alt="" loading="lazy" className="mx-3 h-64 w-96 shrink-0 rounded-[1.5rem] object-cover" />
          ))}
        </Marquee>
      </section>
    </>
  )
}

/** Vertical timeline whose spine draws itself as you scroll (scrollytelling). */
function Timeline() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.6'] })
  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  return (
    <section ref={ref} className="container-x relative py-16">
      <div className="absolute bottom-16 left-[calc(1rem+11px)] top-16 w-px bg-line md:left-1/2">
        <motion.div style={{ height }} className="w-px bg-gradient-to-b from-gold-300 via-gold-500 to-lacquer-500" />
      </div>
      <div className="space-y-20">
        {TIMELINE.map((t, i) => (
          <div key={t.year} className={`relative grid gap-6 pl-12 md:grid-cols-2 md:pl-0 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
            <motion.div initial={{ opacity: 0, x: i % 2 ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className={i % 2 ? 'md:pl-16' : 'md:pr-16 md:text-right'}>
              <div className="font-display text-7xl font-light italic text-gradient-gold">{t.year}</div>
              <h3 className="mt-2 font-display text-3xl">{t.title}</h3>
              <p className="mt-3 text-muted">{t.body}</p>
            </motion.div>
            <div />
            <motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, amount: 0.8 }} className="absolute left-4 top-6 size-6 rounded-full border-4 border-bg bg-gold-400 shadow-[0_0_20px] shadow-gold-400/60 md:left-1/2 md:-translate-x-1/2" />
          </div>
        ))}
      </div>
    </section>
  )
}
