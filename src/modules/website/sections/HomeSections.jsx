import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Clock, MapPin, Navigation, Quote, Star, Utensils, ShoppingBag, Bike, BedDouble, ChefHat } from 'lucide-react'
import { Button, Eyebrow } from '@/core/ui'
import { Reveal, RevealGroup, RevealItem } from '@/core/animation/Reveal'
import { SplitText, ScrollHighlightText } from '@/core/animation/SplitText'
import { Marquee, Tilt, CountUp, Parallax } from '@/core/animation/effects'
import { img } from '@/core/lib/image'
import { formatMoney } from '@/core/lib/format'
import { cn } from '@/core/lib/cn'
import { APP_CONFIG } from '@/core/config/app.config'
import { useCatalogStore, SIGNATURE_IDS, VegMark, SpiceLevel } from '@/modules/catalog'
import { AddToCart } from '@/modules/ordering'
import { useOffersStore } from '@/modules/offers-loyalty'
import { CloudDivider } from '../components/Ornaments'

/* ───────── Dish-name marquee ───────── */
export function DishMarquee() {
  const names = ['Har Gow', 'Kung Pao Chicken', 'Dan Dan Noodles', 'Mapo Tofu', 'Schezwan Fried Rice', 'Chilli Oil Wontons', "Lion's Head", 'Jasmine Pearl Tea']
  return (
    <div className="relative -rotate-1 border-y border-gold-400/20 bg-lacquer-600 py-5">
      <Marquee duration={36}>
        {names.map((n) => (
          <span key={n} className="mx-8 flex items-center gap-8 font-display text-3xl italic text-pearl-50 md:text-4xl">
            {n} <span className="font-cjk text-xl not-italic text-gold-300">✦</span>
          </span>
        ))}
      </Marquee>
    </div>
  )
}

/* ───────── Manifesto (scroll-lit text) ───────── */
export function Manifesto() {
  return (
    <section className="container-x py-32 md:py-44">
      <div className="mx-auto max-w-5xl text-center">
        <CloudDivider className="mx-auto" />
        <ScrollHighlightText
          className="mt-10 justify-center font-display text-3xl leading-[1.25] tracking-tight md:text-5xl"
          text="Every dish begins with *fire,* *patience* and a wok seasoned by decades of service. We cook the way Canton, Sichuan and Shanghai have cooked for centuries — and plate it for tonight."
        />
        <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            [15, '+', 'Years of heritage'],
            [120, '+', 'Dishes on the menu'],
            [4.9, '★', 'Guest rating'],
            [38, 'k', 'Happy guests yearly'],
          ].map(([v, s, label]) => (
            <Reveal key={label} className="rounded-3xl border border-line bg-surface/40 p-6">
              <div className="font-display text-5xl font-semibold text-gradient-gold">
                <CountUp to={v} format={(n) => (Number.isInteger(v) ? Math.round(n) : n.toFixed(1))} />
                <span className="text-3xl">{s}</span>
              </div>
              <div className="mt-2 text-sm text-muted">{label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────── Signature dishes ───────── */
export function SignatureDishes() {
  const items = useCatalogStore((s) => s.items)
  const dishes = SIGNATURE_IDS.map((id) => items.find((i) => i.id === id)).filter(Boolean)
  return (
    <section className="relative py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow cjk="招牌">Signature Dishes</Eyebrow>
            <SplitText text={"Chef's *Recommendations*"} className="mt-5 font-display text-5xl leading-[0.95] tracking-tight md:text-7xl" />
          </div>
          <Button to="/menu" variant="outline" iconRight={ArrowUpRight}>Full menu</Button>
        </div>
        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {dishes.map((d, i) => (
            <RevealItem key={d.id} className={cn(i % 2 === 1 && 'xl:translate-y-14')}>
              <Tilt>
                <article className="group relative overflow-hidden rounded-[2rem] border border-line bg-surface/60">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img src={img(d.image, { w: 700, h: 875 })} alt={d.name} loading="lazy" className="size-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
                    <span className="absolute left-5 top-5 font-display text-sm italic text-pearl-200/80">No. {String(i + 1).padStart(2, '0')}</span>
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="flex items-center gap-2"><VegMark veg={d.veg} /><SpiceLevel level={d.spice} /></div>
                      <h3 className="mt-2 font-display text-2xl text-pearl-50">{d.name}</h3>
                      <p className="mt-1.5 line-clamp-2 text-sm text-pearl-200/70">{d.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-5">
                    <span className="font-display text-2xl font-semibold text-gold-300">{formatMoney(d.price)}</span>
                    <AddToCart dish={d} label="Add to Order" size="sm" />
                  </div>
                </article>
              </Tilt>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

/* ───────── Restaurant experience (Dine With Us) ───────── */
export function Experience() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const clip = useTransform(scrollYProgress, [0, 0.4], ['inset(18% 12% 18% 12% round 3rem)', 'inset(0% 0% 0% 0% round 2rem)'])
  const { brand, timings } = APP_CONFIG
  return (
    <section ref={ref} className="py-28">
      <div className="container-x">
        <motion.div style={{ clipPath: clip }} className="relative h-[70vh] min-h-[460px] overflow-hidden">
          <Parallax speed={0.6} className="absolute -inset-y-24 inset-x-0">
            <img src={img('interiorDark', { w: 2000, q: 70 })} alt="Dragon Pearl dining room" className="size-full object-cover" />
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/50 to-transparent" />
          <div className="relative flex h-full flex-col justify-end p-8 md:p-14">
            <Eyebrow cjk="堂食">Restaurant Experience</Eyebrow>
            <h2 className="mt-4 max-w-2xl font-display text-5xl leading-[0.95] text-pearl-50 md:text-7xl">Dine <span className="italic text-gradient-gold">With Us</span></h2>
            <p className="mt-4 max-w-md text-pearl-200/80">Enjoy a premium Chinese dining experience inside {brand.hotel} — lacquered booths, window tables and two private dining rooms.</p>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <Reveal className="rounded-[2rem] border border-line bg-surface/60 p-8">
            <h3 className="flex items-center gap-3 font-display text-3xl"><Clock className="size-6 text-gold-400" /> Restaurant Timings</h3>
            <div className="mt-6 divide-y divide-line">
              {timings.map((t, i) => (
                <motion.div key={t.label} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center justify-between py-4">
                  <span className="text-lg">{t.label}</span>
                  <span className="font-display text-xl text-gold-200">{t.time}</span>
                </motion.div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={1} className="flex flex-col rounded-[2rem] border border-line bg-gradient-to-br from-lacquer-700/40 to-surface/60 p-8">
            <h3 className="flex items-center gap-3 font-display text-3xl"><MapPin className="size-6 text-gold-400" /> Location</h3>
            <p className="mt-6 text-lg">{brand.address.line1}</p>
            <p className="text-muted">{brand.address.line2}</p>
            <div className="mt-auto pt-8">
              <Button href={brand.address.mapsUrl} target="_blank" rel="noreferrer" variant="gold" icon={Navigation}>Get Directions</Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ───────── Ways to enjoy (bento) ───────── */
export function WaysToEnjoy() {
  const tiles = [
    { to: '/reservations', title: 'Dine-In', copy: 'Window tables, family booths and private dining.', icon: Utensils, image: 'fineDining', cls: 'md:col-span-2 md:row-span-2' },
    { to: '/order', title: 'Takeaway', copy: 'Ready in 20 minutes at the counter.', icon: ShoppingBag, image: 'hakkaDark', cls: '' },
    { to: '/order', title: 'Delivery', copy: 'Hot to your door across Hyderabad.', icon: Bike, image: 'friedRice', cls: '' },
    { to: '/room-service', title: 'Hotel Room Service', copy: 'Charge it straight to your room.', icon: BedDouble, image: 'ramenEgg', cls: 'md:col-span-2' },
  ]
  return (
    <section className="container-x py-28">
      <div className="mb-12 text-center">
        <Eyebrow className="justify-center" cjk="四方">However you dine</Eyebrow>
        <SplitText text={'Four ways to *enjoy* Dragon Pearl'} className="mx-auto mt-5 max-w-3xl font-display text-5xl leading-[0.95] tracking-tight md:text-6xl" />
      </div>
      <RevealGroup className="grid auto-rows-[220px] gap-5 md:grid-cols-4">
        {tiles.map((t) => (
          <RevealItem key={t.title} className={t.cls}>
            <Link to={t.to} className="group relative block size-full overflow-hidden rounded-[2rem] border border-line">
              <img src={img(t.image, { w: 1000, h: 700 })} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/10 transition-colors group-hover:from-lacquer-700/90" />
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <span className="grid size-12 place-items-center rounded-2xl border border-pearl-100/20 bg-ink-950/40 text-gold-300 backdrop-blur"><t.icon className="size-5" /></span>
                <div>
                  <h3 className="flex items-center gap-2 font-display text-3xl text-pearl-50">{t.title}<ArrowUpRight className="size-6 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" /></h3>
                  <p className="mt-1 text-sm text-pearl-200/75">{t.copy}</p>
                </div>
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}

/* ───────── Offers teaser ───────── */
export function OffersTeaser() {
  const offers = useOffersStore((s) => s.offers).filter((o) => o.active).slice(0, 3)
  return (
    <section className="relative overflow-hidden py-28">
      <div className="pattern-lattice absolute inset-0 opacity-30" />
      <div className="container-x relative">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow cjk="優惠">Special Offers</Eyebrow>
            <SplitText text={'Reasons to *gather*'} className="mt-5 font-display text-5xl tracking-tight md:text-6xl" />
          </div>
          <Button to="/offers" variant="outline" iconRight={ArrowUpRight}>All offers</Button>
        </div>
        <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
          {offers.map((o, i) => (
            <RevealItem key={o.id}>
              <Link to="/offers" className={cn('group relative flex h-full min-h-72 flex-col justify-between overflow-hidden rounded-[2rem] border p-7 transition-all duration-500 hover:-translate-y-1', i === 0 ? 'border-gold-400/40 bg-gradient-to-br from-lacquer-600 to-lacquer-700' : 'border-line bg-surface/60')}>
                <span className="absolute -right-6 -top-8 font-cjk text-[9rem] leading-none text-white/5 transition-transform duration-700 group-hover:scale-110">{['宴', '家', '賓'][i]}</span>
                <span className="w-fit rounded-full border border-current/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-200">{o.badge}</span>
                <div>
                  <h3 className="font-display text-3xl text-pearl-50">{o.title}</h3>
                  <p className="mt-2 text-pearl-200/80">{o.subtitle}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="font-display text-2xl text-gold-200">{o.kind === 'combo' ? formatMoney(o.price) : o.code}</span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-pearl-50">{o.cta}<ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" /></span>
                  </div>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

/* ───────── Testimonials ───────── */
const REVIEWS = [
  { name: 'Aditi S.', role: 'Food blogger', text: 'The har gow are as delicate as anything I have eaten in Hong Kong. The Sichuan prawns are pure fire.' },
  { name: 'Mark T.', role: 'Hotel guest, Room 708', text: 'Ordered room service at midnight — charged to the room, arrived hot in 25 minutes. Flawless.' },
  { name: 'Ravi K.', role: 'Regular since 2015', text: 'Kung Pao Chicken that tastes the same every single time. That consistency is rare.' },
  { name: 'Sophie L.', role: 'Business traveller', text: 'Beautiful room, impeccable service and the jasmine pearl tea is a ritual I now miss at home.' },
  { name: 'Nikhil P.', role: 'Family dinner, 8 guests', text: 'The Family Combo fed all of us generously. The private dining room made it feel like a celebration.' },
]

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="container-x mb-12 flex items-center gap-4">
        <ChefHat className="size-6 text-gold-400" />
        <h2 className="font-display text-4xl md:text-5xl">What our guests say</h2>
        <span className="ml-auto hidden items-center gap-1 text-sm text-muted sm:flex"><Star className="size-4 fill-gold-400 text-gold-400" /> 4.9 average · 2,400+ reviews</span>
      </div>
      <Marquee duration={55}>
        {REVIEWS.map((r) => (
          <figure key={r.name} className="mx-3 w-[380px] shrink-0 rounded-[2rem] border border-line bg-surface/60 p-7">
            <Quote className="size-7 text-lacquer-400" />
            <blockquote className="mt-4 font-display text-xl leading-snug">“{r.text}”</blockquote>
            <figcaption className="mt-6 flex items-center justify-between">
              <span><span className="block font-semibold">{r.name}</span><span className="text-xs text-muted">{r.role}</span></span>
              <span className="flex">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="size-3.5 fill-gold-400 text-gold-400" />)}</span>
            </figcaption>
          </figure>
        ))}
      </Marquee>
    </section>
  )
}
