import { motion } from 'framer-motion'
import { cn } from '@/core/lib/cn'

/** Hanging paper lantern (pure SVG) with a gentle sway. */
export function Lantern({ className, delay = 0, size = 64 }) {
  return (
    <motion.div className={cn('pointer-events-none origin-top', className)} animate={{ rotate: [-4, 4, -4] }} transition={{ duration: 5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}>
      <svg width={size} height={size * 2.2} viewBox="0 0 64 140" aria-hidden>
        <defs>
          <radialGradient id={`lg-${size}`} cx="0.5" cy="0.45" r="0.6">
            <stop offset="0" stopColor="#ffb36b" />
            <stop offset="0.45" stopColor="#e5475b" />
            <stop offset="1" stopColor="#7d1025" />
          </radialGradient>
        </defs>
        <line x1="32" y1="0" x2="32" y2="30" stroke="#a97a2f" strokeWidth="1.5" />
        <rect x="22" y="28" width="20" height="6" rx="2" fill="#d09a45" />
        <ellipse cx="32" cy="66" rx="28" ry="34" fill={`url(#lg-${size})`} />
        {[-16, -6, 6, 16].map((dx) => (
          <path key={dx} d={`M${32 + dx * 0.2} 33 Q ${32 + dx * 1.7} 66 ${32 + dx * 0.2} 99`} fill="none" stroke="#7d1025" strokeOpacity="0.45" strokeWidth="1" />
        ))}
        <rect x="22" y="98" width="20" height="6" rx="2" fill="#d09a45" />
        <line x1="32" y1="104" x2="32" y2="134" stroke="#d09a45" strokeWidth="2" />
        <circle cx="32" cy="66" r="40" fill="#ff9a4d" opacity="0.12" />
      </svg>
    </motion.div>
  )
}

/** Traditional cloud scroll motif used as a divider. */
export function CloudDivider({ className }) {
  return (
    <svg viewBox="0 0 240 24" className={cn('h-6 w-60 text-gold-400/60', className)} fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      <path d="M0 12h70" />
      <path d="M170 12h70" />
      <path d="M80 12c0-5 4-8 8-8s8 3 8 7c0-3 3-5 6-5 4 0 6 3 6 6M132 12c0-5 4-8 8-8s8 3 8 7c0-3-3-5-6-5-4 0-6 3-6 6" />
      <circle cx="120" cy="12" r="5" />
      <circle cx="120" cy="12" r="1.5" fill="currentColor" />
      <path d="M96 12c0 5 4 8 8 8s8-3 8-7M144 12c0 5-4 8-8 8s-8-3-8-7" />
    </svg>
  )
}

/** Rising steam wisps for hot dishes. */
export function Steam({ className }) {
  return (
    <div className={cn('pointer-events-none flex gap-3', className)} aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-16 w-2 rounded-full bg-gradient-to-t from-white/0 via-white/25 to-white/0 blur-[3px]"
          animate={{ y: [10, -30], opacity: [0, 0.8, 0], scaleX: [1, 1.8, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.7, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
