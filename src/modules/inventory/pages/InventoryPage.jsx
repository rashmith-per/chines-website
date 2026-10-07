import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import { Boxes, AlertTriangle, PackagePlus, IndianRupee, Search, Truck, Plus, PackageX } from 'lucide-react'
import { PageHeader, Card, Button, Input, Badge, Modal, Field, Select, StatCard, ProgressBar, DataTable } from '@/core/ui'
import { cn } from '@/core/lib/cn'
import { formatMoney, timeAgo } from '@/core/lib/format'
import { useDocumentTitle } from '@/core/hooks'
import { useInventoryStore, stockStatus } from '../store/inventory.store'
import { INVENTORY_CATEGORIES } from '../data/inventory.data'

const STATUS = { ok: ['Available', 'jade'], low: ['Low Stock', 'amber'], out: ['Out of Stock', 'red'] }

export default function InventoryPage() {
  useDocumentTitle('Inventory')
  const items = useInventoryStore((s) => s.items)
  const restockAllLow = useInventoryStore((s) => s.restockAllLow)
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')
  const [onlyLow, setOnlyLow] = useState(false)
  const [restockItem, setRestockItem] = useState(null)
  const [adding, setAdding] = useState(false)

  const low = items.filter((i) => stockStatus(i) !== 'ok')
  const value = items.reduce((s, i) => s + i.stock * i.cost, 0)
  const rows = useMemo(
    () => items.filter((i) => (cat === 'All' || i.category === cat) && (!onlyLow || stockStatus(i) !== 'ok') && i.name.toLowerCase().includes(q.toLowerCase())),
    [items, cat, q, onlyLow],
  )

  const columns = [
    { key: 'name', header: 'Item', render: (i) => <div><div className="font-semibold">{i.name}</div><div className="text-xs text-muted">{i.category} · {i.supplier}</div></div> },
    {
      key: 'stock',
      header: 'Current Stock',
      render: (i) => (
        <div className="w-48">
          <div className="mb-1 flex justify-between text-xs"><span className="font-semibold">{i.stock} {i.unit}</span><span className="text-muted">max {i.max}</span></div>
          <ProgressBar value={i.stock} max={i.max} tone={stockStatus(i) === 'ok' ? 'jade' : stockStatus(i) === 'low' ? 'amber' : 'red'} className="h-1.5" />
        </div>
      ),
    },
    { key: 'min', header: 'Minimum Stock', render: (i) => <span className="text-muted">{i.min} {i.unit}</span> },
    { key: 'days', header: 'Days left', render: (i) => { const d = i.stock / i.usagePerDay; return <span className={cn('font-semibold', d < 2 ? 'text-lacquer-500' : d < 4 ? 'text-amber-500' : '')}>{d.toFixed(1)}</span> } },
    { key: 'status', header: 'Status', render: (i) => { const [l, t] = STATUS[stockStatus(i)]; return <Badge tone={t} dot>{l}</Badge> } },
    { key: 'restocked', header: 'Last restock', render: (i) => <span className="text-xs text-muted">{timeAgo(i.lastRestocked)}</span> },
    { key: 'act', header: '', align: 'right', render: (i) => <Button size="xs" variant="subtle" icon={PackagePlus} onClick={() => setRestockItem(i)}>Restock</Button> },
  ]

  return (
    <>
      <PageHeader title="Inventory" cjk="庫存" subtitle="Stock auto-deducts as orders are placed — low-stock alerts fire before the kitchen runs dry."
        actions={<><Button variant="subtle" icon={Plus} onClick={() => setAdding(true)}>Add item</Button><Button icon={Truck} disabled={!low.length} onClick={() => { const n = restockAllLow(); toast.success(`Purchase order raised for ${n} items`, { description: 'Suppliers notified via email & WhatsApp' }) }}>Reorder low stock</Button></>} />

      <AnimatePresence>
        {low.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
            <AlertTriangle className="size-5 animate-sway text-amber-500" />
            <span className="font-semibold text-amber-700 dark:text-amber-200">Low Stock Alert</span>
            <div className="flex flex-wrap gap-1.5">
              {low.map((i) => (
                <button key={i.id} onClick={() => setRestockItem(i)} className="rounded-lg bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-800 hover:bg-amber-500/25 dark:text-amber-100">{i.name} · {i.stock}{i.unit}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard index={0} label="Tracked items" value={items.length} icon={Boxes} />
        <StatCard index={1} label="Low stock" value={low.filter((i) => stockStatus(i) === 'low').length} icon={AlertTriangle} accent="amber" />
        <StatCard index={2} label="Out of stock" value={low.filter((i) => stockStatus(i) === 'out').length} icon={PackageX} accent="red" />
        <StatCard index={3} label="Stock value" value={value} format={(n) => formatMoney(n)} icon={IndianRupee} accent="jade" />
      </div>

      <Card>
        <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="scrollbar-none flex gap-1.5 overflow-x-auto">
            {['All', ...INVENTORY_CATEGORIES].map((c) => (
              <button key={c} onClick={() => setCat(c)} className={cn('shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition', cat === c ? 'bg-fg text-bg' : 'bg-surface-2 text-muted hover:text-fg')}>{c}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" checked={onlyLow} onChange={(e) => setOnlyLow(e.target.checked)} className="accent-amber-500" /> Low only</label>
            <div className="w-56"><Input icon={Search} placeholder="Search stock…" value={q} onChange={(e) => setQ(e.target.value)} className="h-10" /></div>
          </div>
        </div>
        <DataTable columns={columns} rows={rows} />
      </Card>

      <RestockModal key={restockItem?.id} item={restockItem} onClose={() => setRestockItem(null)} />
      <AddItemModal open={adding} onClose={() => setAdding(false)} />
    </>
  )
}

function RestockModal({ item, onClose }) {
  const restock = useInventoryStore((s) => s.restock)
  const [qty, setQty] = useState(item ? Math.max(0, item.max - item.stock) : 0)
  return (
    <Modal open={!!item} onClose={onClose} title={item ? `Restock ${item.name}` : ''} description={item ? `Current ${item.stock} ${item.unit} · minimum ${item.min} ${item.unit}` : ''} size="sm"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={() => { restock(item.id, qty); toast.success(`${item.name} restocked (+${qty} ${item.unit})`); onClose() }}>Add stock</Button></>}>
      {item && (
        <div className="space-y-4">
          <Field label={`Quantity (${item.unit})`}><Input type="number" min={0} value={qty} onChange={(e) => setQty(e.target.value)} /></Field>
          <div className="rounded-xl bg-surface-2/60 p-3 text-sm"><div className="flex justify-between"><span className="text-muted">Supplier</span><span>{item.supplier}</span></div><div className="flex justify-between"><span className="text-muted">Est. cost</span><span className="font-semibold">{formatMoney(qty * item.cost)}</span></div></div>
        </div>
      )}
    </Modal>
  )
}

function AddItemModal({ open, onClose }) {
  const upsert = useInventoryStore((s) => s.upsertItem)
  const [f, setF] = useState({ name: '', category: 'Vegetables', unit: 'kg', stock: 0, min: 1, max: 10, cost: 100, supplier: '' })
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))
  return (
    <Modal open={open} onClose={onClose} title="Add stock item" footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={() => { if (!f.name) return; upsert({ ...f, stock: +f.stock, min: +f.min, max: +f.max, cost: +f.cost }); toast.success('Item added'); onClose() }}>Save</Button></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" className="sm:col-span-2"><Input value={f.name} onChange={set('name')} /></Field>
        <Field label="Category"><Select value={f.category} onChange={set('category')}>{INVENTORY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select></Field>
        <Field label="Unit"><Select value={f.unit} onChange={set('unit')}>{['kg', 'L', 'pcs', 'pairs'].map((u) => <option key={u}>{u}</option>)}</Select></Field>
        <Field label="Current stock"><Input type="number" value={f.stock} onChange={set('stock')} /></Field>
        <Field label="Minimum stock"><Input type="number" value={f.min} onChange={set('min')} /></Field>
        <Field label="Maximum stock"><Input type="number" value={f.max} onChange={set('max')} /></Field>
        <Field label="Cost / unit (₹)"><Input type="number" value={f.cost} onChange={set('cost')} /></Field>
        <Field label="Supplier" className="sm:col-span-2"><Input value={f.supplier} onChange={set('supplier')} /></Field>
      </div>
    </Modal>
  )
}
