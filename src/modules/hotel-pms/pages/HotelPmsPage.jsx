import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { RefreshCw, PlugZap, Hotel, BedDouble, Utensils, ReceiptText, FileText, Wallet, CheckCircle2, AlertTriangle, Crown, ArrowRight } from 'lucide-react'
import { PageHeader, Card, CardHeader, Button, Badge, Switch, Drawer, StatCard, Avatar, ProgressBar } from '@/core/ui'
import { cn } from '@/core/lib/cn'
import { formatMoney, formatDate, formatDateTime, timeAgo } from '@/core/lib/format'
import { useDocumentTitle } from '@/core/hooks'
import { usePmsStore } from '../store/pms.store'

const FLOW = [
  { label: 'Hotel PMS', icon: Hotel },
  { label: 'Guest / Room Info', icon: BedDouble },
  { label: 'Restaurant System', icon: Utensils },
  { label: 'Room Service Order', icon: ReceiptText },
  { label: 'Guest Folio', icon: FileText },
  { label: 'Hotel Billing', icon: Wallet },
]

export default function HotelPmsPage() {
  useDocumentTitle('Hotel Integration')
  const { connection, settings, guests, log, syncNow, toggleSetting, balanceOf } = usePmsStore()
  const [syncing, setSyncing] = useState(false)
  const [folioId, setFolioId] = useState(null)
  const folio = guests.find((g) => g.id === folioId)
  const restaurantTotal = guests.flatMap((g) => g.charges).filter((c) => c.source === 'restaurant').reduce((s, c) => s + c.amount, 0)
  const postedToday = log.filter((l) => l.type === 'post' && Date.now() - l.at < 86_400_000).length

  const sync = async () => {
    setSyncing(true)
    await new Promise((r) => setTimeout(r, 1200))
    syncNow()
    setSyncing(false)
    toast.success('PMS synchronised', { description: `${guests.length} in-house guests refreshed` })
  }

  return (
    <>
      <PageHeader title="Hotel Integration" cjk="酒店" subtitle="Two-way bridge between Dragon Pearl and the hotel property-management system — room charges land on the guest folio instantly."
        actions={<Button icon={RefreshCw} variant="subtle" onClick={sync} loading={syncing}>Sync now</Button>} />

      {/* Integration flow */}
      <Card className="mb-5 overflow-hidden p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="relative grid size-10 place-items-center rounded-xl bg-jade-500/15 text-jade-500">
              <PlugZap className="size-5" />
              <span className="absolute -right-0.5 -top-0.5 size-3 animate-pulse-ring rounded-full bg-jade-400 text-jade-400" />
            </span>
            <div>
              <div className="font-semibold">{connection.provider} · <span className="text-jade-500">Connected</span></div>
              <div className="text-xs text-muted">{connection.property} · last sync {timeAgo(connection.lastSync)}</div>
            </div>
          </div>
          <Badge tone="jade" dot>Real-time posting</Badge>
        </div>
        <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-1">
          {FLOW.map((step, i) => (
            <div key={step.label} className="flex shrink-0 items-center gap-2">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className={cn('flex w-36 flex-col items-center gap-2 rounded-2xl border p-4 text-center', i === 2 ? 'border-gold-400/60 bg-gold-400/10' : 'border-line bg-surface-2/50')}>
                <step.icon className={cn('size-6', i === 2 ? 'text-gold-500' : 'text-muted')} />
                <span className="text-xs font-semibold">{step.label}</span>
              </motion.div>
              {i < FLOW.length - 1 && (
                <div className="relative h-0.5 w-8 overflow-hidden rounded bg-line-strong">
                  <motion.span className="absolute inset-y-0 w-3 rounded bg-gold-400" animate={{ x: [-12, 32] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2, ease: 'linear' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard index={0} label="In-house guests" value={guests.length} icon={BedDouble} />
        <StatCard index={1} label="Restaurant on folios" value={restaurantTotal} format={(n) => formatMoney(n)} icon={Utensils} accent="jade" />
        <StatCard index={2} label="Charges posted (24h)" value={postedToday} icon={ReceiptText} accent="violet" />
        <StatCard index={3} label="Exceptions" value={log.filter((l) => !l.ok).length} icon={AlertTriangle} accent="red" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <CardHeader title="In-house guests" subtitle="Click a guest to open their folio" icon={Hotel} />
          <div className="mt-4 divide-y divide-line">
            {guests.map((g, i) => {
              const balance = balanceOf(g)
              const rest = g.charges.filter((c) => c.source === 'restaurant').reduce((s, c) => s + c.amount, 0)
              return (
                <motion.button key={g.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} onClick={() => setFolioId(g.id)} className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-surface-2/60">
                  <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-surface-2 font-display text-lg font-semibold">{g.room}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 font-semibold">{g.title} {g.name} {g.vip && <Crown className="size-4 text-gold-500" />}</div>
                    <div className="text-xs text-muted">{g.roomType} · {formatDate(g.checkIn, { year: undefined })} → {formatDate(g.checkOut, { year: undefined })}</div>
                    <ProgressBar value={balance} max={g.creditLimit} tone={balance / g.creditLimit > 0.8 ? 'red' : 'gold'} className="mt-2 h-1.5 max-w-56" />
                  </div>
                  <div className="text-right">
                    <div className="font-semibold tabular-nums">{formatMoney(balance)}</div>
                    <div className="text-xs text-muted">Restaurant {formatMoney(rest)}</div>
                  </div>
                  <ArrowRight className="size-4 text-muted" />
                </motion.button>
              )
            })}
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="font-semibold">Integration rules</h3>
            <div className="mt-4 space-y-4 text-sm">
              {[
                ['autoPost', 'Auto-post room charges', 'Push restaurant bills to the folio instantly'],
                ['verifyGuestName', 'Verify guest name', 'Room number must match the registered guest'],
                ['enforceCreditLimit', 'Enforce folio credit limit', 'Decline charges above the guest limit'],
              ].map(([k, label, hint]) => (
                <div key={k} className="flex items-center justify-between gap-3">
                  <div><div className="font-medium">{label}</div><div className="text-xs text-muted">{hint}</div></div>
                  <Switch checked={settings[k]} onChange={() => toggleSetting(k)} label={label} />
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader title="Sync log" subtitle="Latest interface events" />
            <div className="scrollbar-thin mt-3 max-h-80 space-y-1 overflow-y-auto px-3 pb-3">
              {log.map((l) => (
                <div key={l.id} className="flex gap-3 rounded-xl px-2 py-2.5 hover:bg-surface-2/50">
                  {l.ok ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-jade-500" /> : <AlertTriangle className="mt-0.5 size-4 shrink-0 text-lacquer-500" />}
                  <div className="min-w-0 text-sm"><div>{l.message}</div><div className="text-xs text-muted">{timeAgo(l.at)}</div></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Drawer open={!!folio} onClose={() => setFolioId(null)} title={folio ? `Folio · Room ${folio.room}` : ''} subtitle={folio ? `${folio.title} ${folio.name} · ${folio.roomType}` : ''} width="max-w-lg">
        {folio && (
          <div className="space-y-5 p-6">
            <div className="flex items-center gap-3">
              <Avatar name={folio.name} size="lg" />
              <div>
                <div className="font-semibold">{folio.name} {folio.vip && <Badge tone="gold">VIP</Badge>}</div>
                <div className="text-sm text-muted">Check-out {formatDate(folio.checkOut)} · {folio.adults} adults</div>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-line">
              {folio.charges.slice().sort((a, b) => b.at - a.at).map((c) => (
                <div key={c.id} className="flex items-center justify-between border-b border-line px-4 py-3 text-sm last:border-0">
                  <div>
                    <div className="flex items-center gap-2 font-medium">{c.source === 'restaurant' && <Utensils className="size-3.5 text-gold-500" />}{c.description}</div>
                    <div className="text-xs text-muted">{formatDateTime(c.at)}</div>
                  </div>
                  <span className="font-semibold tabular-nums">{formatMoney(c.amount)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-gold-400/10 p-4">
              <span className="font-semibold">Folio balance</span>
              <span className="font-display text-2xl font-semibold">{formatMoney(balanceOf(folio))}</span>
            </div>
            <p className="text-xs text-muted">Credit limit {formatMoney(folio.creditLimit)}. Restaurant charges settle with the room bill at check-out.</p>
          </div>
        )}
      </Drawer>
    </>
  )
}
