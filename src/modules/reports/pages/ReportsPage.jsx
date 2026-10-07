import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Download, IndianRupee, ShoppingCart, Globe, BadgePercent, Landmark, Receipt, Table2, BarChart3 } from 'lucide-react'
import { PageHeader, Card, CardHeader, Button, Segmented, StatCard, DataTable } from '@/core/ui'
import { axisProps, gridProps, ChartTooltip, ChartLegend } from '@/core/charts/ChartKit'
import { formatMoney, formatCompact } from '@/core/lib/format'
import { useDocumentTitle } from '@/core/hooks'
import { ORDER_TYPE_META, CHART_SERIES_ORDER, CHART_PALETTE } from '@/core/config/app.config'
import { useOrdersStore } from '@/modules/ordering'
import { dailySeries, weeklySeries, monthlySeries } from '../data/reports.data'

const PERIODS = [
  { value: 'daily', label: 'Daily', current: 'Today' },
  { value: 'weekly', label: 'Weekly', current: 'This week' },
  { value: 'monthly', label: 'Monthly', current: 'October 2026' },
]
const PAYMENTS = [
  { key: 'cash', label: 'Cash Collection' },
  { key: 'upi', label: 'UPI Collection' },
  { key: 'card', label: 'Card Collection' },
  { key: 'room', label: 'Room Charges' },
]

export default function ReportsPage() {
  useDocumentTitle('Reports')
  const [period, setPeriod] = useState('monthly')
  const [view, setView] = useState('chart')
  const orders = useOrdersStore((s) => s.orders)

  const series = useMemo(() => (period === 'daily' ? dailySeries() : period === 'weekly' ? weeklySeries() : monthlySeries()), [period])
  const [selIndex, setSelIndex] = useState(null)
  const sel = series[selIndex ?? series.length - 1]
  const prev = series[(selIndex ?? series.length - 1) - 1]
  const trend = (k) => (prev ? Math.round(((sel[k] - prev[k]) / prev[k]) * 1000) / 10 : null)
  const currentLabel = selIndex == null ? PERIODS.find((p) => p.value === period).current : sel.fullLabel ?? sel.label

  const topDishes = useMemo(() => {
    const map = {}
    orders.filter((o) => o.status !== 'cancelled').forEach((o) => o.items.forEach((l) => (map[l.name] = (map[l.name] ?? 0) + l.qty)))
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6)
  }, [orders])

  const exportCsv = () => {
    const cols = ['label', 'total', 'dine-in', 'takeaway', 'delivery', 'room-service', 'orders', 'online', 'cash', 'upi', 'card', 'room', 'discounts', 'tax']
    const csv = [cols.join(','), ...series.map((r) => cols.map((c) => `"${r[c]}"`).join(','))].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `dragon-pearl-${period}-sales.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const columns = [
    { key: 'label', header: 'Period', render: (r) => <span className="font-semibold">{r.fullLabel ?? r.label}</span> },
    ...CHART_SERIES_ORDER.map((k) => ({ key: k, header: ORDER_TYPE_META[k].label, align: 'right', render: (r) => formatMoney(r[k]) })),
    { key: 'online', header: 'Online orders', align: 'right' },
    { key: 'discounts', header: 'Discounts', align: 'right', render: (r) => formatMoney(r.discounts) },
    { key: 'tax', header: 'Tax', align: 'right', render: (r) => formatMoney(r.tax) },
    { key: 'total', header: 'Total Sales', align: 'right', render: (r) => <span className="font-semibold">{formatMoney(r.total)}</span> },
  ]

  return (
    <>
      <PageHeader title="Sales Reports" cjk="報表" subtitle="Revenue by channel, collections, discounts and tax — click a bar to drill into that period."
        actions={<>
          <Segmented layoutId="rep-period" value={period} onChange={(p) => { setPeriod(p); setSelIndex(null) }} options={PERIODS} />
          <Button variant="subtle" icon={Download} onClick={exportCsv}>Export CSV</Button>
        </>} />

      <div className="mb-2 text-sm text-muted">Showing <span className="font-semibold text-fg">{currentLabel}</span>{selIndex != null && <button onClick={() => setSelIndex(null)} className="ml-2 text-gold-600 hover:underline dark:text-gold-300">reset</button>}</div>
      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard key={`t${sel.label}`} index={0} label="Total Sales" value={sel.total} format={(n) => formatMoney(n)} icon={IndianRupee} trend={trend('total')} className="xl:col-span-2" />
        <StatCard key={`o${sel.label}`} index={1} label="Orders" value={sel.orders} icon={ShoppingCart} accent="jade" trend={trend('orders')} />
        <StatCard key={`a${sel.label}`} index={2} label="Online Orders" value={sel.online} icon={Globe} accent="violet" trend={trend('online')} />
        <StatCard key={`d${sel.label}`} index={3} label="Discounts" value={sel.discounts} format={(n) => formatMoney(n)} icon={BadgePercent} accent="amber" />
        <StatCard key={`x${sel.label}`} index={4} label="Tax Collection" value={sel.tax} format={(n) => formatMoney(n)} icon={Landmark} accent="sky" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <CardHeader title="Revenue by channel" subtitle={`${PERIODS.find((p) => p.value === period).label} · stacked`} icon={BarChart3}
            action={<Segmented size="sm" layoutId="rep-view" value={view} onChange={setView} options={[{ value: 'chart', label: 'Chart', icon: BarChart3 }, { value: 'table', label: 'Table', icon: Table2 }]} />} />
          {view === 'chart' ? (
            <div className="px-3 pb-4 pt-3">
              <ChartLegend className="mb-3 px-2" items={CHART_SERIES_ORDER.map((k) => ({ label: ORDER_TYPE_META[k].label, color: ORDER_TYPE_META[k].color }))} />
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={series} margin={{ top: 8, right: 8, left: 4, bottom: 0 }} onClick={(e) => e?.activeTooltipIndex != null && setSelIndex(Number(e.activeTooltipIndex))}>
                    <CartesianGrid {...gridProps} />
                    <XAxis dataKey="label" {...axisProps} interval="preserveStartEnd" minTickGap={16} />
                    <YAxis {...axisProps} width={48} tickFormatter={(v) => `₹${formatCompact(v)}`} />
                    <Tooltip cursor={{ fill: 'var(--line)' }} content={<ChartTooltip format={(v) => formatMoney(v)} />} />
                    {CHART_SERIES_ORDER.map((k, i) => (
                      <Bar key={k} dataKey={k} name={ORDER_TYPE_META[k].label} stackId="a" fill={ORDER_TYPE_META[k].color} stroke="var(--surface)" strokeWidth={2} radius={i === CHART_SERIES_ORDER.length - 1 ? [4, 4, 0, 0] : 0} maxBarSize={36} cursor="pointer" />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <DataTable className="mt-3" columns={columns} rows={series.map((r) => ({ ...r, id: r.label })).reverse()} dense />
          )}
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="font-semibold">Channel revenue</h3>
            <p className="text-xs text-muted">{currentLabel}</p>
            <BarList className="mt-4" rows={CHART_SERIES_ORDER.map((k) => ({ label: `${ORDER_TYPE_META[k].label} Revenue`, value: sel[k], color: ORDER_TYPE_META[k].color }))} total={sel.total} />
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold">Collections</h3>
            <p className="text-xs text-muted">By payment method</p>
            <BarList className="mt-4" rows={PAYMENTS.map((p, i) => ({ label: p.label, value: sel[p.key], color: CHART_PALETTE[i] }))} total={sel.total} />
          </Card>
        </div>
      </div>

      <Card className="mt-5 p-5">
        <div className="mb-4 flex items-center gap-2"><Receipt className="size-4 text-gold-500" /><h3 className="font-semibold">Top dishes today</h3><span className="text-xs text-muted">· live from orders</span></div>
        <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
          {topDishes.map(([name, qty], i) => (
            <div key={name} className="flex items-center gap-3">
              <span className="w-5 font-display text-lg text-muted">{i + 1}</span>
              <div className="flex-1">
                <div className="mb-1 flex justify-between text-sm"><span className="font-medium">{name}</span><span className="font-semibold tabular-nums">{qty} sold</span></div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-3"><motion.div initial={{ width: 0 }} animate={{ width: `${(qty / topDishes[0][1]) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.05 }} className="h-full rounded-full bg-gold-500" /></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

/** Horizontal part-to-whole bars with direct labels (no legend needed). */
export function BarList({ rows, total, className }) {
  return (
    <div className={`space-y-3.5 ${className ?? ''}`}>
      {rows.map((r, i) => (
        <div key={r.label} className="group">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted"><span className="size-2.5 rounded-sm" style={{ background: r.color }} />{r.label}</span>
            <span className="font-semibold tabular-nums">{formatMoney(r.value)} <span className="ml-1 text-xs font-normal text-muted">{Math.round((r.value / total) * 100)}%</span></span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-3">
            <motion.div key={r.value} initial={{ width: 0 }} animate={{ width: `${(r.value / total) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }} className="h-full rounded-full" style={{ background: r.color }} />
          </div>
        </div>
      ))}
    </div>
  )
}
