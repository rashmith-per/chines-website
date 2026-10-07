import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react'
import { Button, Avatar, Badge, Logo } from '@/core/ui'
import { cn } from '@/core/lib/cn'
import { img } from '@/core/lib/image'
import { useApplyTheme } from '@/core/theme/theme.store'
import { useDocumentTitle } from '@/core/hooks'
import { useStaffStore } from '@/modules/staff'
import { useSessionStore } from '../store/session.store'

const DEMO_IDS = ['s1', 's2', 's3', 's4', 's7']

export default function LoginPage() {
  useDocumentTitle('Staff sign-in')
  useApplyTheme('dark')
  const staff = useStaffStore((s) => s.staff)
  const roles = useStaffStore((s) => s.roles)
  const signIn = useSessionStore((s) => s.signIn)
  const navigate = useNavigate()
  const location = useLocation()
  const [selected, setSelected] = useState('s1')
  const [pin, setPin] = useState('')
  const profiles = DEMO_IDS.map((id) => staff.find((s) => s.id === id)).filter(Boolean)

  const submit = (e) => {
    e.preventDefault()
    const user = staff.find((s) => s.id === selected)
    signIn(selected)
    toast.success(`Welcome back, ${user.name.split(' ')[0]}`)
    const landing = { chef: '/admin/kds', kitchen: '/admin/kds', cashier: '/admin/pos', waiter: '/admin/tables' }[user.role] ?? '/admin'
    navigate(location.state?.from ?? landing, { replace: true })
  }

  return (
    <div className="grid min-h-dvh bg-bg text-fg lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <motion.img initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }} src={img('chefPlating', { w: 1400, q: 70 })} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-ink-950/20" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <div className="font-cjk text-6xl text-gold-300/90">龍珠</div>
          <h2 className="mt-4 max-w-md font-display text-5xl leading-tight text-pearl-50">The operating system for <i className="text-gradient-gold">Dragon Pearl.</i></h2>
          <p className="mt-4 max-w-md text-pearl-200/70">POS, kitchen display, tables, reservations, inventory and hotel PMS — in one place.</p>
        </div>
      </div>
      <div className="flex flex-col p-6 sm:p-12">
        <div className="flex items-center justify-between">
          <Logo subtitle="Restaurant OS" />
          <Button to="/" variant="ghost" size="sm" icon={ArrowLeft}>Website</Button>
        </div>
        <motion.form onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="m-auto w-full max-w-md py-12">
          <h1 className="font-display text-4xl">Staff sign-in</h1>
          <p className="mt-2 text-sm text-muted">Choose a demo profile — each role sees only what its permissions allow.</p>
          <div className="mt-8 space-y-2">
            {profiles.map((p) => {
              const role = roles.find((r) => r.id === p.role)
              return (
                <button type="button" key={p.id} onClick={() => setSelected(p.id)} className={cn('flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition', selected === p.id ? 'border-gold-400 bg-gold-400/10' : 'border-line hover:border-line-strong')}>
                  <Avatar name={p.name} />
                  <div className="flex-1"><div className="font-semibold">{p.name}</div><div className="text-xs text-muted">{role?.permissions.length} permissions</div></div>
                  <Badge tone={role?.color}>{role?.name}</Badge>
                </button>
              )
            })}
          </div>
          <label className="mt-6 block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">4-digit PIN (any digits for demo)</span>
            <div className="mt-2 flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={cn('grid h-14 flex-1 place-items-center rounded-xl border text-2xl', pin.length > i ? 'border-gold-400 text-gold-300' : 'border-line')}>{pin.length > i ? '•' : ''}</span>
              ))}
            </div>
            <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" autoComplete="off" className="sr-only" autoFocus />
          </label>
          <Button type="submit" size="lg" className="mt-6 w-full" iconRight={ArrowRight}>Sign in</Button>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted"><ShieldCheck className="size-3.5" /> Front-end demo — no real credentials are used</p>
        </motion.form>
      </div>
    </div>
  )
}
