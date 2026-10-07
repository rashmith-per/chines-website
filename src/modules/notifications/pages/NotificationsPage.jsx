import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import { CheckCheck, Send, Bell, Megaphone } from 'lucide-react'
import { PageHeader, Card, CardHeader, Button, Segmented, Badge, Field, Input, Textarea } from '@/core/ui'
import { cn } from '@/core/lib/cn'
import { timeAgo } from '@/core/lib/format'
import { useDocumentTitle } from '@/core/hooks'
import { useNotificationsStore, CHANNELS, EVENT_TYPES } from '../store/notifications.store'
import { KIND_ICON, CHANNEL_ICON } from '../components/icons'

export default function NotificationsPage() {
  useDocumentTitle('Notifications')
  const { items, markAllRead, markRead } = useNotificationsStore()
  const [audience, setAudience] = useState('all')
  const feed = items.filter((n) => audience === 'all' || n.audience === audience)

  return (
    <>
      <PageHeader title="Notifications" cjk="通知" subtitle="Customer & restaurant alerts across website, SMS, email, WhatsApp and push."
        actions={<Button variant="subtle" icon={CheckCheck} onClick={() => markAllRead()}>Mark all read</Button>} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_520px]">
        <Card>
          <div className="flex items-center justify-between border-b border-line p-4">
            <Segmented size="sm" layoutId="ntf-aud" value={audience} onChange={setAudience} options={[{ value: 'all', label: 'All' }, { value: 'restaurant', label: 'Restaurant' }, { value: 'customer', label: 'Customer' }]} />
            <span className="text-xs text-muted">{items.filter((n) => !n.read).length} unread</span>
          </div>
          <div className="scrollbar-thin max-h-[70vh] overflow-y-auto">
            <AnimatePresence initial={false}>
              {feed.map((n) => {
                const Icon = KIND_ICON[n.kind] ?? Bell
                return (
                  <motion.button layout key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} onClick={() => markRead(n.id)} className={cn('flex w-full gap-4 border-b border-line px-5 py-4 text-left transition hover:bg-surface-2/50', !n.read && 'bg-gold-400/5')}>
                    <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', n.audience === 'customer' ? 'bg-violet-500/10 text-violet-500' : 'bg-gold-400/12 text-gold-600 dark:text-gold-300')}><Icon className="size-5" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{n.title}</span>
                        <Badge tone={n.audience === 'customer' ? 'violet' : 'gold'}>{n.audience}</Badge>
                        {!n.read && <span className="size-2 rounded-full bg-lacquer-500" />}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted">{n.body}</span>
                      <span className="mt-2 flex items-center gap-1.5">
                        {(n.channels ?? ['website']).map((c) => {
                          const CI = CHANNEL_ICON[c]
                          return <span key={c} title={c} className="grid size-6 place-items-center rounded-md bg-surface-2 text-muted"><CI className="size-3.5" /></span>
                        })}
                        <span className="ml-2 text-xs text-muted">{timeAgo(n.at)}</span>
                      </span>
                    </span>
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>
        </Card>
        <div className="space-y-5">
          <ChannelMatrix />
          <Broadcast />
        </div>
      </div>
    </>
  )
}

function ChannelMatrix() {
  const { settings, toggleChannel } = useNotificationsStore()
  const [aud, setAud] = useState('customer')
  return (
    <Card>
      <CardHeader title="Channels per event" subtitle="Choose how each alert is delivered" icon={Bell} action={<Segmented size="sm" layoutId="ntf-matrix" value={aud} onChange={setAud} options={[{ value: 'customer', label: 'Customer' }, { value: 'restaurant', label: 'Restaurant' }]} />} />
      <div className="scrollbar-thin mt-4 overflow-x-auto px-2 pb-3">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Event</th>
              {CHANNELS.map((c) => {
                const CI = CHANNEL_ICON[c.id]
                return <th key={c.id} className="px-2 py-2 text-center text-[10px] font-semibold text-muted"><CI className="mx-auto mb-1 size-4" />{c.label}</th>
              })}
            </tr>
          </thead>
          <tbody>
            {EVENT_TYPES[aud].map((e) => (
              <tr key={e.id} className="border-t border-line">
                <td className="px-3 py-2.5 font-medium">{e.label}</td>
                {CHANNELS.map((c) => {
                  const on = settings[e.id]?.[c.id]
                  return (
                    <td key={c.id} className="px-2 py-2.5 text-center">
                      <button onClick={() => toggleChannel(e.id, c.id)} aria-label={`${e.label} via ${c.label}`} className={cn('mx-auto block h-5 w-9 rounded-full p-0.5 transition-colors', on ? 'bg-jade-500' : 'bg-surface-3')}>
                        <motion.span layout className={cn('block size-4 rounded-full bg-white shadow', on && 'ml-auto')} />
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function Broadcast() {
  const push = useNotificationsStore((s) => s.push)
  const [title, setTitle] = useState('Weekend Chinese Feast is here!')
  const [message, setMessage] = useState('20% OFF Dim Sum, Mains & Sichuan Specials this Fri–Sun. Use FEAST20 🐉')
  return (
    <Card>
      <CardHeader title="Broadcast an offer" subtitle="Sends to opted-in Pearl Rewards members" icon={Megaphone} />
      <div className="grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_200px]">
        <div className="space-y-3">
          <Field label="Title"><Input value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
          <Field label="Message"><Textarea value={message} onChange={(e) => setMessage(e.target.value)} /></Field>
          <Button icon={Send} onClick={() => { push({ audience: 'customer', kind: 'special-offers', title, body: message }); toast.success('Offer broadcast queued', { description: '2,846 members · WhatsApp, Email, Push' }) }}>Send broadcast</Button>
        </div>
        {/* WhatsApp-style preview */}
        <div className="rounded-2xl bg-[#0b141a] p-3">
          <div className="mb-2 text-center text-[10px] text-white/40">Preview · WhatsApp</div>
          <div className="ml-auto max-w-full rounded-xl rounded-tr-sm bg-[#005c4b] p-2.5 text-[12px] leading-snug text-white shadow">
            <div className="font-bold">{title}</div>
            <div className="mt-1 whitespace-pre-wrap text-white/90">{message}</div>
            <div className="mt-1 text-right text-[9px] text-white/50">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} ✓✓</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
