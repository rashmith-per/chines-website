import { Link } from 'react-router-dom'
import { cn } from '@/core/lib/cn'

/** Dragon Pearl emblem — pearl ring with 龍 glyph. */
export function Emblem({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={cn('size-10', className)} aria-hidden>
      <defs>
        <linearGradient id="emb-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3dfb3" />
          <stop offset="0.5" stopColor="#e0b062" />
          <stop offset="1" stopColor="#a97a2f" />
        </linearGradient>
        <radialGradient id="emb-r" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#e5475b" />
          <stop offset="1" stopColor="#7d1025" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#emb-r)" />
      <circle cx="24" cy="24" r="18.5" fill="none" stroke="url(#emb-g)" strokeWidth="1.4" strokeDasharray="2 2.6" />
      <text x="24" y="31.5" textAnchor="middle" fontFamily="'Noto Serif SC', serif" fontWeight="900" fontSize="21" fill="url(#emb-g)">
        龍
      </text>
    </svg>
  )
}

export function Logo({ to = '/', className, compact = false, subtitle = 'Authentic Chinese' }) {
  return (
    <Link to={to} className={cn('group flex items-center gap-3', className)} aria-label="Dragon Pearl home">
      <Emblem className="transition-transform duration-700 group-hover:rotate-[360deg]" />
      {!compact && (
        <span className="whitespace-nowrap leading-none">
          <span className="block font-display text-xl font-semibold tracking-tight">
            Dragon <span className="italic text-gradient-gold">Pearl</span>
          </span>
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.32em] text-muted">{subtitle}</span>
        </span>
      )}
    </Link>
  )
}

/** Small uppercase kicker used above section titles. */
export function Eyebrow({ children, className, cjk }) {
  return (
    <div className={cn('flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-gold-400', className)}>
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold-400" />
      {cjk && <span className="font-cjk text-sm tracking-normal">{cjk}</span>}
      {children}
    </div>
  )
}
