import { motion } from 'framer-motion'
import { cn } from '@/core/lib/cn'
import { EmptyState } from './primitives'
import { Inbox } from 'lucide-react'

/**
 * Lightweight declarative table.
 * columns: [{ key, header, render?(row), className?, align? }]
 */
export function DataTable({ columns, rows, rowKey = 'id', onRowClick, empty, className, dense = false }) {
  if (!rows.length) {
    return empty ?? <EmptyState icon={Inbox} title="Nothing here yet" description="Records will appear here as they come in." />
  }
  return (
    <div className={cn('scrollbar-thin overflow-x-auto', className)}>
      <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  'sticky top-0 z-10 border-b border-line bg-surface px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted',
                  c.align === 'right' && 'text-right',
                  c.align === 'center' && 'text-center',
                  c.headerClassName,
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <motion.tr
              key={row[rowKey]}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.025, 0.4) }}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn('group transition-colors', onRowClick && 'cursor-pointer hover:bg-surface-2/70')}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn(
                    'border-b border-line px-4 align-middle',
                    dense ? 'py-2.5' : 'py-3.5',
                    c.align === 'right' && 'text-right',
                    c.align === 'center' && 'text-center',
                    c.className,
                  )}
                >
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
