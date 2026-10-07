import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { cn } from '@/core/lib/cn'

const variants = {
  primary:
    'bg-gradient-to-b from-lacquer-500 to-lacquer-600 text-white shadow-[0_8px_30px_-8px] shadow-lacquer-500/60 hover:shadow-lacquer-500/80 hover:brightness-110',
  gold: 'bg-gradient-to-b from-gold-300 to-gold-500 text-ink-950 shadow-[0_8px_30px_-10px] shadow-gold-400/60 hover:brightness-105',
  outline: 'border border-line-strong text-fg hover:border-gold-400/70 hover:text-gold-300 dark:hover:text-gold-300 hover:bg-gold-400/5',
  ghost: 'text-fg hover:bg-surface-2',
  subtle: 'bg-surface-2 text-fg hover:bg-surface-3 border border-line',
  danger: 'bg-lacquer-500/10 text-lacquer-500 dark:text-lacquer-300 hover:bg-lacquer-500/20 border border-lacquer-500/25',
  success: 'bg-jade-500 text-white hover:bg-jade-600',
  light: 'bg-pearl-100 text-ink-950 hover:bg-white',
}

const sizes = {
  xs: 'h-7 px-2.5 text-xs gap-1 rounded-lg',
  sm: 'h-9 px-3.5 text-sm gap-1.5 rounded-xl',
  md: 'h-11 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-13 px-7 text-base gap-2.5 rounded-2xl',
  icon: 'size-10 rounded-xl',
  'icon-sm': 'size-8 rounded-lg',
}

export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', to, href, loading, icon: Icon, iconRight: IconRight, className, children, disabled, ...props },
  ref,
) {
  const classes = cn(
    'relative inline-flex select-none items-center justify-center whitespace-nowrap font-semibold tracking-tight transition-all duration-300 ease-[var(--ease-silk)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45',
    variants[variant],
    sizes[size],
    className,
  )
  const content = (
    <>
      {loading ? <Loader2 className="size-4 animate-spin" /> : Icon && <Icon className="size-[1.1em] shrink-0" />}
      {children}
      {IconRight && <IconRight className="size-[1.1em] shrink-0 transition-transform group-hover:translate-x-0.5" />}
    </>
  )
  if (to) {
    return (
      <Link ref={ref} to={to} className={cn('group', classes)} {...props}>
        {content}
      </Link>
    )
  }
  if (href) {
    return (
      <a ref={ref} href={href} className={cn('group', classes)} {...props}>
        {content}
      </a>
    )
  }
  return (
    <button ref={ref} className={cn('group', classes)} disabled={disabled || loading} {...props}>
      {content}
    </button>
  )
})
