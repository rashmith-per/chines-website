import { cn } from '@/core/lib/cn'

/** Shared Recharts styling so every chart in the back office reads as one system. */
export const axisProps = {
  stroke: 'var(--muted)',
  tick: { fill: 'var(--muted)', fontSize: 11 },
  tickLine: false,
  axisLine: false,
}

export const gridProps = { stroke: 'var(--line)', strokeDasharray: '0', vertical: false }

/** Tooltip body: text in ink tokens, colour only on the swatch. */
export function ChartTooltip({ active, payload, label, format = (v) => v, labelFormat = (l) => l }) {
  if (!active || !payload?.length) return null
  const total = payload.length > 1 ? payload.reduce((s, p) => s + (Number(p.value) || 0), 0) : null
  return (
    <div className="min-w-44 rounded-xl border border-line bg-surface/95 px-3 py-2.5 text-xs shadow-xl backdrop-blur">
      {label != null && <div className="mb-1.5 font-semibold text-fg">{labelFormat(label)}</div>}
      <div className="space-y-1">
        {payload.map((p) => (
          <div key={p.dataKey ?? p.name} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-muted">
              <span className="size-2.5 rounded-sm" style={{ background: p.color ?? p.payload?.fill }} />
              {p.name}
            </span>
            <span className="font-semibold tabular-nums text-fg">{format(p.value)}</span>
          </div>
        ))}
        {total != null && (
          <div className="mt-1 flex justify-between border-t border-line pt-1 font-semibold text-fg">
            <span>Total</span>
            <span className="tabular-nums">{format(total)}</span>
          </div>
        )}
      </div>
    </div>
  )
}

/** Legend rendered above the plot; text in ink, swatch carries identity. */
export function ChartLegend({ items, className }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted', className)}>
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm" style={{ background: i.color }} />
          {i.label}
          {i.value != null && <span className="font-semibold text-fg">{i.value}</span>}
        </span>
      ))}
    </div>
  )
}
