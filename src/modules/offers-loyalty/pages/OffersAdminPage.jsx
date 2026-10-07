import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, TicketPercent, Users, Gift, Trash2, Crown, TrendingUp } from 'lucide-react'
import { PageHeader, Card, CardHeader, Button, Switch, Badge, DataTable, Modal, Field, Input, Select, Textarea, StatCard, Segmented, Avatar, SmartImage } from '@/core/ui'
import { formatMoney, timeAgo } from '@/core/lib/format'
import { img } from '@/core/lib/image'
import { useDocumentTitle } from '@/core/hooks'
import { CATEGORIES } from '@/modules/catalog'
import { useOffersStore, useLoyaltyStore } from '../store/offers.store'
import { TIERS, REWARDS } from '../data/offers.data'

export default function OffersAdminPage() {
  useDocumentTitle('Offers & Loyalty')
  const [tab, setTab] = useState('offers')
  const offers = useOffersStore((s) => s.offers)
  const members = useLoyaltyStore((s) => s.members)
  const [open, setOpen] = useState(false)
  const totalRedemptions = offers.reduce((s, o) => s + o.redemptions, 0)

  return (
    <>
      <PageHeader title="Offers & Loyalty" cjk="優惠" subtitle="Campaigns, coupon codes and the Pearl Rewards programme." actions={tab === 'offers' && <Button icon={Plus} onClick={() => setOpen(true)}>New Offer</Button>} />
      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard index={0} label="Active offers" value={offers.filter((o) => o.active).length} icon={TicketPercent} />
        <StatCard index={1} label="Redemptions" value={totalRedemptions} icon={TrendingUp} accent="jade" trend={12} hint="this month" />
        <StatCard index={2} label="Loyalty members" value={2840 + members.length} icon={Users} accent="violet" trend={8} />
        <StatCard index={3} label="Points outstanding" value={members.reduce((s, m) => s + m.points, 0) + 412000} icon={Gift} accent="amber" />
      </div>
      <Segmented layoutId="offers-tab" value={tab} onChange={setTab} options={[{ value: 'offers', label: 'Offers & coupons' }, { value: 'loyalty', label: 'Loyalty members' }, { value: 'programme', label: 'Programme' }]} className="mb-5" />
      {tab === 'offers' && <OffersGrid offers={offers} />}
      {tab === 'loyalty' && <Members members={members} />}
      {tab === 'programme' && <Programme />}
      <OfferModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}

function OffersGrid({ offers }) {
  const { toggleActive, removeOffer } = useOffersStore()
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {offers.map((o) => (
        <Card key={o.id} hover className="overflow-hidden">
          <div className="relative h-32">
            <SmartImage src={img(o.image, { w: 600, h: 260 })} alt="" className="size-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
              <div className="font-display text-xl font-semibold">{o.title}</div>
              <Badge tone={o.active ? 'jade' : 'neutral'} className="bg-black/40">{o.active ? 'Live' : 'Paused'}</Badge>
            </div>
          </div>
          <div className="space-y-3 p-4">
            <p className="text-sm text-muted">{o.subtitle}</p>
            <div className="flex items-center justify-between text-sm">
              {o.code ? <span className="rounded-lg border border-dashed border-gold-400/50 px-2 py-0.5 font-bold tracking-widest text-gold-600 dark:text-gold-300">{o.code}</span> : <Badge tone="gold">Combo {formatMoney(o.price)}</Badge>}
              <span className="text-muted">{o.redemptions} redeemed</span>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-3">
              <div className="flex items-center gap-2 text-sm"><Switch size="sm" checked={o.active} onChange={() => toggleActive(o.id)} label="Active" /> Active</div>
              <button onClick={() => { removeOffer(o.id); toast('Offer removed') }} className="rounded-lg p-1.5 text-muted hover:bg-lacquer-500/10 hover:text-lacquer-500" aria-label="Delete offer"><Trash2 className="size-4" /></button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function Members({ members }) {
  const adjust = useLoyaltyStore((s) => s.adjustMember)
  const columns = [
    { key: 'name', header: 'Member', render: (m) => <div className="flex items-center gap-3"><Avatar name={m.name} /><div><div className="font-semibold">{m.name}</div><div className="text-xs text-muted">{m.mobile}</div></div></div> },
    { key: 'tier', header: 'Tier', render: (m) => <Badge tone={TIERS.find((t) => t.id === m.tier)?.color}>{m.tier === 'imperial' && <Crown className="size-3" />}{TIERS.find((t) => t.id === m.tier)?.name}</Badge> },
    { key: 'points', header: 'Points', align: 'right', render: (m) => <span className="font-semibold tabular-nums">{m.points.toLocaleString('en-IN')}</span> },
    { key: 'visits', header: 'Visits', align: 'right' },
    { key: 'spend', header: 'Lifetime spend', align: 'right', render: (m) => formatMoney(m.spend) },
    { key: 'last', header: 'Last visit', render: (m) => <span className="text-muted">{timeAgo(m.lastVisit)}</span> },
    { key: 'act', header: '', align: 'right', render: (m) => <div className="flex justify-end gap-1"><Button size="xs" variant="subtle" onClick={() => { adjust(m.id, 100); toast.success(`+100 pts to ${m.name}`) }}>+100</Button><Button size="xs" variant="subtle" onClick={() => adjust(m.id, -100)}>−100</Button></div> },
  ]
  return <Card><DataTable columns={columns} rows={members} /></Card>
}

function Programme() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader title="Tiers" subtitle="Based on lifetime points" icon={Crown} />
        <div className="space-y-3 p-5">
          {TIERS.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-xl border border-line p-4">
              <div><div className="font-semibold">{t.name}</div><div className="text-xs text-muted">{t.min.toLocaleString('en-IN')}+ pts</div></div>
              <span className="text-sm">{t.perk}</span>
            </div>
          ))}
          <p className="text-xs text-muted">Earn rate: 1 point per ₹10 · Redemption: 10 points = ₹1</p>
        </div>
      </Card>
      <Card>
        <CardHeader title="Rewards catalogue" icon={Gift} />
        <div className="space-y-2 p-5">
          {REWARDS.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-xl bg-surface-2/60 px-4 py-3 text-sm">
              <span className="font-medium">{r.name}</span>
              <span><b>{r.points}</b> pts <span className="text-muted">· worth {formatMoney(r.value)}</span></span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function OfferModal({ open, onClose }) {
  const upsert = useOffersStore((s) => s.upsertOffer)
  const [f, setF] = useState({ title: '', subtitle: '', description: '', code: '', kind: 'percent', value: 10, minOrder: 0, category: '' })
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))
  const save = () => {
    if (!f.title || !f.code) return toast.error('Title and code are required')
    upsert({ ...f, code: f.code.toUpperCase(), value: Number(f.value), minOrder: Number(f.minOrder) || undefined, categories: f.category ? [f.category] : undefined, image: 'tableSpread', badge: 'New', cta: 'Order Now' })
    toast.success('Offer published')
    onClose()
  }
  return (
    <Modal open={open} onClose={onClose} title="New Offer" description="Publishes instantly to the website and checkout." footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={save}>Publish</Button></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" required className="sm:col-span-2"><Input value={f.title} onChange={set('title')} placeholder="Monsoon Noodle Fest" /></Field>
        <Field label="Headline" className="sm:col-span-2"><Input value={f.subtitle} onChange={set('subtitle')} placeholder="15% OFF all noodles" /></Field>
        <Field label="Coupon code" required><Input value={f.code} onChange={set('code')} className="uppercase" placeholder="NOODLE15" /></Field>
        <Field label="Type"><Select value={f.kind} onChange={set('kind')}><option value="percent">Percentage</option><option value="flat">Flat ₹</option></Select></Field>
        <Field label="Value"><Input type="number" value={f.value} onChange={set('value')} /></Field>
        <Field label="Minimum order (₹)"><Input type="number" value={f.minOrder} onChange={set('minOrder')} /></Field>
        <Field label="Limit to category" className="sm:col-span-2"><Select value={f.category} onChange={set('category')}><option value="">Whole menu</option>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></Field>
        <Field label="Description" className="sm:col-span-2"><Textarea value={f.description} onChange={set('description')} /></Field>
      </div>
    </Modal>
  )
}
