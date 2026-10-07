import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Copy, ArrowRight, Gift, Crown, Sparkles } from 'lucide-react'
import { PageHero, Button, SmartImage } from '@/core/ui'
import { Reveal, RevealGroup, RevealItem } from '@/core/animation/Reveal'
import { Tilt } from '@/core/animation/effects'
import { img } from '@/core/lib/image'
import { formatMoney } from '@/core/lib/format'
import { cn } from '@/core/lib/cn'
import { useDocumentTitle } from '@/core/hooks'
import { useCartStore } from '@/modules/ordering'
import { useOffersStore, useLoyaltyStore } from '../store/offers.store'
import { FAMILY_COMBO_DISH, TIERS, REWARDS } from '../data/offers.data'

export default function OffersPage() {
  useDocumentTitle('Offers')
  const offers = useOffersStore((s) => s.offers)
  const active = offers.filter((o) => o.active)
  const [hero, ...rest] = active
  const navigate = useNavigate()
  const cart = useCartStore()

  const claim = (o) => {
    if (o.kind === 'combo') {
      cart.add(FAMILY_COMBO_DISH)
      toast.success('Family Combo added to your order')
      cart.open()
      return
    }
    if (o.code) {
      cart.setCoupon(o.code)
      navigator.clipboard?.writeText(o.code).catch(() => {})
      toast.success(`${o.code} applied to your cart`, { description: o.subtitle })
    }
    if (o.id === 'hotel-guest') return navigate('/room-service')
    navigate('/order')
  }

  return (
    <>
      <PageHero eyebrow="Special Offers" cjk="優惠" title={'Feasts worth *sharing*'} subtitle="Seasonal deals, family combos and exclusive savings for hotel guests." image="tableSpread" />

      <section className="container-x pb-20">
        {hero && <FeatureOffer offer={hero} onClaim={() => claim(hero)} />}
        <RevealGroup className="mt-8 grid gap-6 md:grid-cols-2">
          {rest.map((o, i) => (
            <RevealItem key={o.id}>
              <Tilt max={5}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface/70">
                  <div className="relative h-56 overflow-hidden">
                    <SmartImage src={img(o.image, { w: 900, h: 500 })} alt={o.title} className="size-full" imgClassName="transition-transform duration-[1.2s] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-lacquer-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">{o.badge}</span>
                    {o.kind === 'combo' && (
                      <span className="absolute right-4 top-4 rounded-2xl bg-ink-950/70 px-3 py-2 text-right backdrop-blur">
                        <span className="block text-[10px] text-pearl-300 line-through">{formatMoney(o.worth)}</span>
                        <span className="font-display text-2xl font-semibold text-gold-300">{formatMoney(o.price)}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className={cn('font-display text-sm italic', i % 2 ? 'text-jade-300' : 'text-gold-300')}>{o.subtitle}</span>
                    <h3 className="mt-1 font-display text-3xl">{o.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{o.description}</p>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                      {o.code ? (
                        <button onClick={() => { navigator.clipboard?.writeText(o.code).catch(() => {}); toast.success(`Copied ${o.code}`) }} className="flex items-center gap-2 rounded-xl border border-dashed border-gold-400/50 px-3 py-2 text-sm font-bold tracking-widest text-gold-300 hover:bg-gold-400/10">
                          {o.code} <Copy className="size-3.5" />
                        </button>
                      ) : <span />}
                      <Button variant="gold" iconRight={ArrowRight} onClick={() => claim(o)}>{o.cta}</Button>
                    </div>
                  </div>
                </article>
              </Tilt>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <LoyaltyBand />
    </>
  )
}

function FeatureOffer({ offer, onClaim }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  return (
    <Reveal>
      <div ref={ref} className="relative grid overflow-hidden rounded-[2rem] border border-gold-400/25 bg-gradient-to-br from-lacquer-700/40 via-surface to-surface lg:grid-cols-2">
        <div className="relative z-10 flex flex-col justify-center p-8 sm:p-12">
          <span className="w-fit rounded-full border border-gold-400/40 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-300">{offer.badge}</span>
          <h2 className="mt-5 font-display text-5xl leading-none md:text-6xl">{offer.title}</h2>
          <div className="mt-4 font-display text-7xl font-semibold text-gradient-gold md:text-8xl">20% <span className="text-4xl">OFF</span></div>
          <p className="mt-4 max-w-md text-muted">{offer.description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" iconRight={ArrowRight} onClick={onClaim}>{offer.cta}</Button>
            <span className="text-sm text-muted">Use code <b className="tracking-widest text-gold-300">{offer.code}</b></span>
          </div>
        </div>
        <div className="relative min-h-80 overflow-hidden">
          <motion.img style={{ y }} src={img(offer.image, { w: 1200, h: 1000 })} alt="" className="absolute inset-0 size-[124%] -top-[12%] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent lg:from-surface/90" />
          <span className="pointer-events-none absolute bottom-4 right-6 font-cjk text-8xl text-gold-300/30">宴</span>
        </div>
      </div>
    </Reveal>
  )
}

function LoyaltyBand() {
  const points = useLoyaltyStore((s) => s.points)
  const value = useLoyaltyStore((s) => s.rupeeValue)(points)
  return (
    <section className="relative overflow-hidden border-y border-line bg-surface/40 py-20">
      <div className="pattern-lattice absolute inset-0 opacity-40" />
      <div className="container-x relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_1.2fr] lg:items-center">
        <Reveal>
          <div className="text-[11px] font-bold uppercase tracking-[0.32em] text-gold-400">Pearl Rewards · 珠寶會</div>
          <h2 className="mt-4 font-display text-5xl leading-tight">Every meal earns <span className="italic text-gradient-gold">pearls.</span></h2>
          <p className="mt-4 max-w-md text-muted">Earn 1 point for every ₹10 spent — online, dine-in or room service. Redeem for dishes, discounts and priority tables.</p>
          <div className="mt-8 inline-flex items-center gap-5 rounded-3xl border border-gold-400/30 bg-gold-400/5 p-5">
            <Gift className="size-10 text-gold-300" />
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted">Your Points</div>
              <div className="font-display text-4xl font-semibold">{points.toLocaleString('en-IN')} <span className="text-base text-muted">pts</span></div>
              <div className="text-sm text-gold-300">{formatMoney(value)} available reward</div>
            </div>
            <Button to="/account?tab=loyalty" variant="gold" size="sm">Redeem Points</Button>
          </div>
        </Reveal>
        <RevealGroup className="grid gap-4 sm:grid-cols-3">
          {TIERS.map((t, i) => (
            <RevealItem key={t.id} className={cn('rounded-3xl border p-6', i === 1 ? 'border-gold-400/50 bg-gold-400/10' : 'border-line bg-surface/70')}>
              {i === 2 ? <Crown className="size-7 text-lacquer-400" /> : <Sparkles className={cn('size-7', i === 1 ? 'text-gold-300' : 'text-jade-300')} />}
              <div className="mt-4 font-display text-2xl">{t.name}</div>
              <div className="text-xs text-muted">{t.min ? `${t.min.toLocaleString('en-IN')}+ lifetime pts` : 'On sign-up'}</div>
              <p className="mt-3 text-sm">{t.perk}</p>
            </RevealItem>
          ))}
          <RevealItem className="rounded-3xl border border-line bg-surface/70 p-6 sm:col-span-3">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Popular rewards</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {REWARDS.map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-xl bg-surface-2/60 px-4 py-2.5 text-sm"><span>{r.name}</span><span className="font-semibold text-gold-300">{r.points} pts</span></div>
              ))}
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  )
}
