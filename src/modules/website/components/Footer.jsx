import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Camera, Share2, AtSign, ArrowUpRight, LockKeyhole } from 'lucide-react'
import { Logo, Button } from '@/core/ui'
import { Magnetic } from '@/core/animation/effects'
import { APP_CONFIG } from '@/core/config/app.config'
import { NAV_LINKS } from './Navbar'
import { Lantern } from './Ornaments'

export function Footer() {
  const { brand, timings } = APP_CONFIG
  return (
    <footer className="grain relative overflow-hidden border-t border-line bg-ink-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(196,30,58,0.22),transparent_60%)]" />
      <Lantern className="absolute left-[8%] top-0 hidden md:block" size={44} />
      <Lantern className="absolute right-[10%] top-0 hidden md:block" size={56} delay={1.2} />

      <div className="container-x relative pt-24">
        <div className="flex flex-col items-center text-center">
          <span className="font-cjk text-lg tracking-[0.5em] text-gold-400/80">龍珠宴</span>
          <h2 className="mt-4 max-w-3xl font-display text-5xl leading-[0.95] tracking-tight md:text-7xl">An evening worth <span className="italic text-gradient-gold">remembering.</span></h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Magnetic><Button to="/reservations" size="lg">Reserve a Table</Button></Magnetic>
            <Magnetic><Button to="/order" size="lg" variant="outline">Order Online</Button></Magnetic>
          </div>
        </div>

        <div className="mt-24 grid gap-10 border-t border-line pt-14 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">{brand.tagline}. A premium Chinese dining experience inside {brand.hotel}.</p>
            <div className="mt-6 flex gap-2">
              {[Camera, Share2, AtSign].map((Icon, i) => (
                <a key={i} href="#" className="grid size-10 place-items-center rounded-xl border border-line text-muted transition hover:border-gold-400/50 hover:text-gold-300" aria-label="Social link"><Icon className="size-4" /></a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.24em] text-gold-400">Visit</h4>
            <ul className="mt-5 space-y-3 text-sm text-muted">
              <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-gold-400" />{brand.address.line1}<br />{brand.address.line2}</li>
              <li className="flex gap-3"><Phone className="size-4 text-gold-400" />{brand.phone}</li>
              <li className="flex gap-3"><Mail className="size-4 text-gold-400" />{brand.email}</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.24em] text-gold-400">Hours</h4>
            <ul className="mt-5 space-y-3 text-sm">
              {timings.map((t) => (
                <li key={t.label} className="flex items-center justify-between gap-4 border-b border-line pb-3"><span className="flex items-center gap-2 text-muted"><Clock className="size-4 text-gold-400" />{t.label}</span><span>{t.time}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.24em] text-gold-400">Explore</h4>
            <ul className="mt-5 grid grid-cols-2 gap-y-2.5 text-sm">
              {[...NAV_LINKS, { to: '/room-service', label: 'Room Service' }, { to: '/track', label: 'Track Order' }, { to: '/account', label: 'My Account' }].map((l) => (
                <li key={l.to}><Link to={l.to} className="group inline-flex items-center gap-1 text-muted transition hover:text-gold-300">{l.label}<ArrowUpRight className="size-3 opacity-0 transition group-hover:opacity-100" /></Link></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <motion.div initial={{ y: '40%', opacity: 0 }} whileInView={{ y: '0%', opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-outline pointer-events-none relative mt-10 select-none whitespace-nowrap text-center font-display text-[17vw] font-semibold leading-[0.8] tracking-tighter">
        Dragon Pearl
      </motion.div>
      <div className="container-x relative flex flex-col items-center justify-between gap-3 border-t border-line py-6 text-xs text-muted sm:flex-row">
        <span>© {new Date().getFullYear()} {brand.name}. All rights reserved.</span>
        <Link to="/admin/login" className="flex items-center gap-1.5 hover:text-gold-300"><LockKeyhole className="size-3.5" /> Staff portal</Link>
      </div>
    </footer>
  )
}
