import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Search, Pencil, Trash2, UtensilsCrossed, EyeOff, Leaf, Flame } from 'lucide-react'
import { PageHeader, Card, Button, Input, Select, Switch, DataTable, Modal, Field, Textarea, SmartImage, Badge, StatCard } from '@/core/ui'
import { img, imageKeys } from '@/core/lib/image'
import { formatMoney } from '@/core/lib/format'
import { useDocumentTitle } from '@/core/hooks'
import { useCatalogStore } from '../store/catalog.store'
import { CATEGORIES, STATIONS } from '../data/menu.data'
import { VegMark, SpiceLevel } from '../components/DishBits'

export default function MenuManagerPage() {
  useDocumentTitle('Menu')
  const { items, toggleAvailability, removeItem } = useCatalogStore()
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState(null)
  const rows = useMemo(() => items.filter((i) => (cat === 'all' || i.category === cat) && i.name.toLowerCase().includes(q.toLowerCase())), [items, cat, q])
  const catName = (id) => CATEGORIES.find((c) => c.id === id)?.name ?? id

  const columns = [
    { key: 'dish', header: 'Dish', render: (d) => <div className="flex items-center gap-3"><SmartImage src={img(d.image, { w: 120, h: 120 })} alt="" className="size-12 shrink-0 rounded-xl" /><div><div className="flex items-center gap-2 font-semibold"><VegMark veg={d.veg} />{d.name}</div><div className="max-w-72 truncate text-xs text-muted">{d.description}</div></div></div> },
    { key: 'category', header: 'Category', render: (d) => <span className="text-muted">{catName(d.category)}</span> },
    { key: 'station', header: 'KDS station', render: (d) => <Badge>{d.station}</Badge> },
    { key: 'spice', header: 'Spice', render: (d) => <SpiceLevel level={d.spice} /> },
    { key: 'tags', header: 'Tags', render: (d) => <div className="flex flex-wrap gap-1">{d.tags?.map((t) => <Badge key={t} tone="gold">{t}</Badge>)}</div> },
    { key: 'price', header: 'Price', align: 'right', render: (d) => <span className="font-semibold tabular-nums">{formatMoney(d.price)}</span> },
    { key: 'available', header: 'Available', align: 'center', render: (d) => <Switch size="sm" checked={d.available} onChange={() => { toggleAvailability(d.id); toast(`${d.name} ${d.available ? 'marked sold out' : 'back on the menu'}`) }} label="Available" /> },
    { key: 'act', header: '', align: 'right', render: (d) => <div className="flex justify-end gap-1"><button onClick={() => setEditing(d)} className="rounded-lg p-1.5 text-muted hover:bg-surface-2 hover:text-fg" aria-label="Edit"><Pencil className="size-4" /></button><button onClick={() => { removeItem(d.id); toast('Dish removed') }} className="rounded-lg p-1.5 text-muted hover:bg-lacquer-500/10 hover:text-lacquer-500" aria-label="Delete"><Trash2 className="size-4" /></button></div> },
  ]

  return (
    <>
      <PageHeader title="Menu" cjk="菜單" subtitle="Changes publish instantly to the website, online ordering, POS and room service." actions={<Button icon={Plus} onClick={() => setEditing({})}>Add dish</Button>} />
      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard index={0} label="Dishes" value={items.length} icon={UtensilsCrossed} />
        <StatCard index={1} label="Sold out" value={items.filter((i) => !i.available).length} icon={EyeOff} accent="red" />
        <StatCard index={2} label="Vegetarian" value={items.filter((i) => i.veg).length} icon={Leaf} accent="jade" />
        <StatCard index={3} label="Spicy (2+)" value={items.filter((i) => i.spice >= 2).length} icon={Flame} accent="amber" />
      </div>
      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-4">
          <Select value={cat} onChange={(e) => setCat(e.target.value)} className="h-10 w-48"><option value="all">All categories</option>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
          <div className="w-64"><Input icon={Search} placeholder="Search dishes…" value={q} onChange={(e) => setQ(e.target.value)} className="h-10" /></div>
        </div>
        <DataTable columns={columns} rows={rows} />
      </Card>
      <DishModal key={editing?.id ?? 'new'} dish={editing} onClose={() => setEditing(null)} />
    </>
  )
}

function DishModal({ dish, onClose }) {
  const upsert = useCatalogStore((s) => s.upsertItem)
  const [f, setF] = useState({ name: '', description: '', category: 'main-course', station: 'Main Course', price: 300, veg: false, spice: 0, image: 'spread', prepTime: 15, ...dish })
  const set = (k, cast = (v) => v) => (e) => setF((x) => ({ ...x, [k]: cast(e.target.value) }))
  const isEdit = !!dish?.id
  return (
    <Modal open={!!dish} onClose={onClose} title={isEdit ? 'Edit dish' : 'Add dish'} size="lg"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={() => { if (!f.name) return toast.error('Name is required'); upsert(f); toast.success(isEdit ? 'Dish updated' : 'Dish added to menu'); onClose() }}>Save</Button></>}>
      <div className="grid gap-5 md:grid-cols-[220px_1fr]">
        <div>
          <SmartImage src={img(f.image, { w: 440, h: 440 })} alt="" className="aspect-square rounded-2xl" />
          <Field label="Photo" className="mt-3"><Select value={f.image} onChange={set('image')}>{imageKeys.map((k) => <option key={k}>{k}</option>)}</Select></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" required className="sm:col-span-2"><Input value={f.name} onChange={set('name')} /></Field>
          <Field label="Description" className="sm:col-span-2"><Textarea value={f.description} onChange={set('description')} /></Field>
          <Field label="Category"><Select value={f.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></Field>
          <Field label="KDS station"><Select value={f.station} onChange={set('station')}>{STATIONS.map((s) => <option key={s}>{s}</option>)}</Select></Field>
          <Field label="Price (₹)"><Input type="number" value={f.price} onChange={set('price', Number)} /></Field>
          <Field label="Prep time (min)"><Input type="number" value={f.prepTime} onChange={set('prepTime', Number)} /></Field>
          <Field label="Spice level"><Select value={f.spice} onChange={set('spice', Number)}>{[0, 1, 2, 3].map((n) => <option key={n} value={n}>{['None', 'Mild', 'Medium', 'Hot'][n]}</option>)}</Select></Field>
          <Field label="Diet"><Select value={f.veg ? 'veg' : 'non'} onChange={(e) => setF((x) => ({ ...x, veg: e.target.value === 'veg' }))}><option value="veg">Vegetarian</option><option value="non">Non-vegetarian</option></Select></Field>
        </div>
      </div>
    </Modal>
  )
}
