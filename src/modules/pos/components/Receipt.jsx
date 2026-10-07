import { APP_CONFIG, PAYMENT_META } from '@/core/config/app.config'
import { formatMoney, formatDateTime } from '@/core/lib/format'

/** Thermal-printer style receipt. Rendered inside `.print-area` so only it prints. */
export function Receipt({ bill }) {
  const { brand } = APP_CONFIG
  return (
    <div className="print-area mx-auto w-full max-w-[340px] rounded-2xl bg-white p-6 font-mono text-[12px] leading-relaxed text-neutral-900 shadow-inner">
      <div className="text-center">
        <div className="font-[family-name:var(--font-cjk)] text-2xl font-black text-[#c41e3a]">龍珠</div>
        <div className="text-base font-bold tracking-wider">{brand.name.toUpperCase()}</div>
        <div className="text-[10px] text-neutral-500">{brand.address.line1}</div>
        <div className="text-[10px] text-neutral-500">{brand.address.line2}</div>
        <div className="text-[10px] text-neutral-500">GSTIN 36AABCD1234E1Z5 · {brand.phone}</div>
      </div>
      <div className="my-3 border-t border-dashed border-neutral-400" />
      <div className="flex justify-between"><span>Bill</span><span>{bill.number}</span></div>
      <div className="flex justify-between"><span>Date</span><span>{formatDateTime(bill.at)}</span></div>
      {bill.tableId && <div className="flex justify-between"><span>Table</span><span>{bill.tableId}</span></div>}
      {bill.waiter && <div className="flex justify-between"><span>Waiter</span><span>{bill.waiter}</span></div>}
      <div className="my-3 border-t border-dashed border-neutral-400" />
      <div className="grid grid-cols-[minmax(0,1fr)_28px_52px_64px] gap-1 font-bold">
        <span>Item</span><span className="text-right">Qty</span><span className="text-right">Price</span><span className="text-right">Total</span>
      </div>
      {bill.lines.map((l) => (
        <div key={l.id} className="grid grid-cols-[minmax(0,1fr)_28px_52px_64px] gap-1">
          <span className="truncate">{l.name}</span>
          <span className="text-right">{l.qty}</span>
          <span className="text-right">{l.price}</span>
          <span className="text-right">{(l.price * l.qty).toFixed(2)}</span>
        </div>
      ))}
      <div className="my-3 border-t border-dashed border-neutral-400" />
      <Line label="Subtotal" value={formatMoney(bill.totals.subtotal, { precise: true })} />
      {bill.totals.discount > 0 && <Line label="Discount" value={`- ${formatMoney(bill.totals.discount, { precise: true })}`} />}
      <Line label="CGST 9%" value={formatMoney(bill.totals.tax / 2, { precise: true })} />
      <Line label="SGST 9%" value={formatMoney(bill.totals.tax / 2, { precise: true })} />
      <div className="my-2 border-t border-neutral-900" />
      <div className="flex justify-between text-sm font-bold"><span>GRAND TOTAL</span><span>{formatMoney(bill.totals.total, { precise: true })}</span></div>
      {bill.method && <div className="mt-1 flex justify-between"><span>Paid via</span><span>{PAYMENT_META[bill.method]?.label}</span></div>}
      <div className="my-3 border-t border-dashed border-neutral-400" />
      <div className="text-center text-[10px] text-neutral-500">Thank you for dining with us · 謝謝<br />Earn loyalty points — dragonpearl.in</div>
    </div>
  )
}

const Line = ({ label, value }) => (
  <div className="flex justify-between"><span>{label}</span><span>{value}</span></div>
)
