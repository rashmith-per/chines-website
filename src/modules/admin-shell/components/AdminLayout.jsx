import { Suspense, useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import { Menu, Moon, Sun, PanelLeftClose, PanelLeftOpen, Globe, LogOut, RotateCcw, ChevronDown, Search, Check } from 'lucide-react'
import { Logo, Emblem, Avatar, Kbd, Badge } from '@/core/ui'
import { cn } from '@/core/lib/cn'
import { useThemeStore, useApplyTheme } from '@/core/theme/theme.store'
import { resetAllStores } from '@/core/store/createStore'
import { useMediaQuery } from '@/core/hooks'
import { useCurrentUser, usePermission, useSessionStore } from '@/modules/auth'
import { useStaffStore } from '@/modules/staff'
import { useOrdersStore } from '@/modules/ordering'
import { NotificationBell } from '@/modules/notifications'
import { CommandPalette } from './CommandPalette'

const GROUPS = ['Overview', 'Operations', 'Business']

/**
 * Back-office chrome. `nav` is composed by the app layer from every module manifest,
 * so a new module appears in the sidebar without touching this file.
 */
export function AdminLayout({ nav }) {
  const { adminTheme, toggleAdminTheme, sidebarCollapsed, toggleSidebar } = useThemeStore()
  useApplyTheme(adminTheme)
  const can = usePermission()
  const user = useCurrentUser()
  const location = useLocation()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const items = nav.filter((n) => can(n.permission))
  const collapsed = isDesktop && sidebarCollapsed
  const current = items.find((n) => (n.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(n.path)))

  useEffect(() => setMobileOpen(false), [location.pathname])
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  useLiveOrderAlerts()

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className={cn('flex h-16 shrink-0 items-center border-b border-line', collapsed ? 'justify-center' : 'px-5')}>
        {collapsed ? <Emblem className="size-9" /> : <Logo to="/admin" subtitle="Restaurant OS" />}
      </div>
      <nav className="scrollbar-thin flex-1 space-y-5 overflow-y-auto px-3 py-5">
        {GROUPS.map((g) => {
          const groupItems = items.filter((i) => i.group === g)
          if (!groupItems.length) return null
          return (
            <div key={g}>
              {!collapsed && <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.24em] text-muted/70">{g}</div>}
              <div className="space-y-0.5">
                {groupItems.map((item) => <NavItem key={item.path} item={item} collapsed={collapsed} />)}
              </div>
            </div>
          )
        })}
      </nav>
      <div className="space-y-1 border-t border-line p-3">
        <SideAction icon={Globe} label="View website" collapsed={collapsed} onClick={() => window.open('/', '_blank')} />
        <SideAction icon={RotateCcw} label="Reset demo data" collapsed={collapsed} onClick={() => confirm('Reset all demo data to the initial seed?') && resetAllStores()} />
        {isDesktop && <SideAction icon={collapsed ? PanelLeftOpen : PanelLeftClose} label="Collapse sidebar" collapsed={collapsed} onClick={toggleSidebar} />}
      </div>
    </div>
  )

  return (
    <div className="min-h-dvh bg-bg text-fg">
      {/* Desktop sidebar */}
      <motion.aside animate={{ width: collapsed ? 80 : 264 }} transition={{ type: 'spring', stiffness: 320, damping: 34 }} className="fixed inset-y-0 left-0 z-40 hidden border-r border-line bg-surface lg:block">
        {sidebar}
      </motion.aside>
      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-ink-950/60 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
            <motion.aside className="fixed inset-y-0 left-0 z-50 w-72 border-r border-line bg-surface lg:hidden" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 320, damping: 34 }}>
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="transition-[padding] duration-300" style={{ paddingLeft: isDesktop ? (collapsed ? 80 : 264) : 0 }}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-bg/80 px-4 backdrop-blur-xl lg:px-6">
          <button onClick={() => setMobileOpen(true)} className="grid size-10 place-items-center rounded-xl hover:bg-surface-2 lg:hidden" aria-label="Open menu"><Menu className="size-5" /></button>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">{current?.group ?? 'Overview'}</div>
            <div className="truncate font-semibold">{current?.label ?? 'Dashboard'}</div>
          </div>
          <button onClick={() => setPaletteOpen(true)} className="ml-auto hidden h-10 w-72 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm text-muted transition hover:border-line-strong md:flex">
            <Search className="size-4" /> Jump to…<span className="ml-auto flex gap-1"><Kbd>Ctrl</Kbd><Kbd>K</Kbd></span>
          </button>
          <div className="ml-auto flex items-center gap-1 md:ml-2">
            <span className="mr-2 hidden items-center gap-1.5 rounded-full bg-jade-500/10 px-2.5 py-1 text-xs font-semibold text-jade-600 dark:text-jade-300 sm:flex"><span className="size-1.5 animate-pulse rounded-full bg-jade-500" />Live</span>
            <button onClick={toggleAdminTheme} className="grid size-10 place-items-center rounded-xl text-muted transition hover:bg-surface-2 hover:text-fg" aria-label="Toggle theme">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={adminTheme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  {adminTheme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
            <NotificationBell />
            <UserMenu user={user} />
          </div>
        </header>
        <main className="p-4 lg:p-6">
          <Suspense fallback={<PageSkeleton />}>
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <Outlet />
            </motion.div>
          </Suspense>
        </main>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} items={items} />
    </div>
  )
}

function NavItem({ item, collapsed }) {
  return (
    <NavLink to={item.path} end={item.path === '/admin'} title={collapsed ? item.label : undefined}
      className={({ isActive }) => cn('group relative flex h-10 items-center gap-3 rounded-xl text-sm font-medium transition-colors', collapsed ? 'justify-center' : 'px-3', isActive ? 'text-fg' : 'text-muted hover:bg-surface-2 hover:text-fg')}>
      {({ isActive }) => (
        <>
          {isActive && <motion.span layoutId="nav-active" className="absolute inset-0 rounded-xl border border-gold-400/30 bg-gradient-to-r from-gold-400/15 to-transparent" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
          {isActive && <motion.span layoutId="nav-bar" className="absolute -left-3 h-5 w-1 rounded-r-full bg-gold-400" />}
          <item.icon className={cn('relative size-[18px] shrink-0', isActive && 'text-gold-600 dark:text-gold-300')} />
          {!collapsed && <span className="relative flex-1 truncate">{item.label}</span>}
          {item.useBadge && <NavBadge hook={item.useBadge} tone={item.badgeTone} collapsed={collapsed} />}
        </>
      )}
    </NavLink>
  )
}

function NavBadge({ hook, tone, collapsed }) {
  const count = hook()
  if (!count) return null
  return collapsed ? (
    <span className={cn('absolute right-3 top-2 size-2 rounded-full', tone === 'amber' ? 'bg-amber-500' : 'bg-lacquer-500')} />
  ) : (
    <motion.span key={count} initial={{ scale: 0.6 }} animate={{ scale: 1 }} className={cn('relative grid min-w-5 place-items-center rounded-md px-1.5 text-[10px] font-bold', tone === 'amber' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300' : 'bg-lacquer-500 text-white')}>
      {count}
    </motion.span>
  )
}

function SideAction({ icon: Icon, label, collapsed, onClick }) {
  return (
    <button onClick={onClick} title={collapsed ? label : undefined} className={cn('flex h-9 w-full items-center gap-3 rounded-xl text-sm text-muted transition hover:bg-surface-2 hover:text-fg', collapsed ? 'justify-center' : 'px-3')}>
      <Icon className="size-4 shrink-0" />{!collapsed && label}
    </button>
  )
}

function UserMenu({ user }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()
  const { signIn, signOut } = useSessionStore()
  const staff = useStaffStore((s) => s.staff)
  const roles = useStaffStore((s) => s.roles)
  useEffect(() => {
    if (!open) return
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false)
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [open])
  if (!user) return null
  const quick = ['s1', 's2', 's3', 's4', 's7'].map((id) => staff.find((s) => s.id === id)).filter(Boolean)
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 transition hover:bg-surface-2">
        <Avatar name={user.name} size="sm" />
        <span className="hidden text-left leading-tight sm:block"><span className="block text-sm font-semibold">{user.name.split(' ')[0]}</span><span className="block text-[10px] text-muted">{user.roleInfo?.name}</span></span>
        <ChevronDown className="size-4 text-muted" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
            <div className="border-b border-line p-4"><div className="font-semibold">{user.name}</div><div className="text-xs text-muted">{user.email}</div></div>
            <div className="p-2">
              <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Switch demo role</div>
              {quick.map((s) => {
                const role = roles.find((r) => r.id === s.role)
                return (
                  <button key={s.id} onClick={() => { signIn(s.id); setOpen(false); toast(`Signed in as ${s.name} (${role?.name})`); navigate('/admin') }} className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left text-sm hover:bg-surface-2">
                    <Avatar name={s.name} size="sm" />
                    <span className="flex-1">{s.name}</span>
                    {s.id === user.id ? <Check className="size-4 text-jade-500" /> : <Badge tone={role?.color}>{role?.name}</Badge>}
                  </button>
                )
              })}
            </div>
            <button onClick={() => { signOut(); navigate('/admin/login') }} className="flex w-full items-center gap-2 border-t border-line px-4 py-3 text-sm font-semibold text-lacquer-500 hover:bg-lacquer-500/5"><LogOut className="size-4" /> Sign out</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Toast when a new online / room-service order lands (also from other tabs via storage sync). */
function useLiveOrderAlerts() {
  const navigate = useNavigate()
  useEffect(() => {
    let known = new Set(useOrdersStore.getState().orders.map((o) => o.id))
    return useOrdersStore.subscribe((state) => {
      const fresh = state.orders.filter((o) => !known.has(o.id))
      known = new Set(state.orders.map((o) => o.id))
      fresh.filter((o) => o.source !== 'pos').forEach((o) =>
        toast.info(`New ${o.type.replace('-', ' ')} order #${o.code}`, {
          description: `${o.customer?.name ?? 'Guest'} · ${o.items.length} items`,
          action: { label: 'Open KDS', onClick: () => navigate('/admin/kds') },
          duration: 6000,
        }),
      )
    })
  }, [navigate])
}

function PageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="skeleton h-10 w-64 rounded-xl" />
      <div className="grid gap-4 md:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>
      <div className="skeleton h-96 rounded-2xl" />
    </div>
  )
}
