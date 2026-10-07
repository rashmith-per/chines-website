import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Check, X, CalendarClock, Armchair, Plus, Users, CalendarDays, List, GanttChart } from 'lucide-react'
import { PageHeader, Card, DataTable, Button, Modal, Field, Input, Select, Segmented, StatCard, Textarea } from '@/core/ui'
import { cn } from '@/core/lib/cn'
import { to12h, todayISO } from '@/core/lib/format'
import { useDocumentTitle } from '@/core/hooks'
import { useTablesStore } from '@/modules/tables'
import { useReservationsStore, toMin } from '../../store/reservations.store'
import { ReservationStatusBadge } from '../../components/ReservationStatusBadge'

const days = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(Date.now() + i * 86_400_000)
  return { iso: d.toISOString().slice(0, 10), dow: d.toLocaleDateString('en-IN', { weekday: 'short' }), day: d.getDate() }
})

export default function ReservationsAdminPage() {
  useDocumentTitle('Reservations')
  const reservations = useReservationsStore((s) => s.reservations)
  const update = useReservationsStore((s) => s.update)
  const tables = useTablesStore((s) => s.tables)
  const [date, setDate] = useState(todayISO())
  const [view, setView] = useState('list')
  const [modal, setModal] = useState(null) // { kind: 'reschedule'|'assign'|'new', r }

  const rows = useMemo(() => reservations.filter((r) => r.date === date).sort((a, b) => toMin(a.time) - toMin(b.time)), [reservations, date])
  const covers = rows.filter((r) => r.status !== 'cancelled').reduce((n, r) => n + Number(r.guests), 0)

  const act = (r, patch, msg) => {
    update(r.id, patch)
    toast.success(msg)
  }

  const columns = [
    { key: 'time', header: 'Time', render: (r) => <span className="font-display text-lg font-semibold">{to12h(r.time)}</span> },
    { key: 'name', header: 'Guest', render: (r) => <div><div className="font-semibold">{r.name}</div><div className="text-xs text-muted">{r.code} · {r.source}</div></div> },
    { key: 'guests', header: 'Guests', render: (r) => <span className="flex items-center gap-1.5"><Users className="size-3.5 text-muted" />{r.guests}</span> },
    { key: 'table', header: 'Table', render: (r) => (r.tableId ? <span className="rounded-lg bg-surface-2 px-2 py-1 font-semibold">{r.tableId}</span> : <span className="text-xs text-amber-500">Unassigned</span>) },
    { key: 'seating', header: 'Preference', render: (r) => <div><div>{r.seating}</div>{r.request && <div className="max-w-52 truncate text-xs text-muted" title={r.request}>“{r.request}”</div>}</div> },
    { key: 'status', header: 'Status', render: (r) => <ReservationStatusBadge status={r.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (r) =>
        r.status === 'cancelled' || r.status === 'completed' ? null : (
          <div className="flex justify-end gap-1">
            {r.status === 'pending' && <IconBtn title="Confirm" icon={Check} tone="jade" onClick={() => act(r, { status: 'confirmed' }, `${r.name} confirmed`)} />}
            {r.status === 'confirmed' && r.tableId && <IconBtn title="Seat guests" icon={Armchair} tone="gold" onClick={() => { act(r, { status: 'seated' }, `${r.name} seated at ${r.tableId}`); useTablesStore.getState().seat(r.tableId, { guest: r.name, covers: r.guests }) }} />}
            <IconBtn title="Reschedule" icon={CalendarClock} onClick={() => setModal({ kind: 'reschedule', r })} />
            <IconBtn title="Assign table" icon={GanttChart} onClick={() => setModal({ kind: 'assign', r })} />
            <IconBtn title="Cancel" icon={X} tone="red" onClick={() => act(r, { status: 'cancelled' }, `${r.code} cancelled`)} />
          </div>
        ),
    },
  ]

  return (
    <>
      <PageHeader title="Reservations" cjk="訂位" subtitle="Today's bookings, table assignment and the evening's flow." actions={<Button icon={Plus} onClick={() => setModal({ kind: 'new' })}>New Reservation</Button>} />

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard index={0} label="Bookings" value={rows.filter((r) => r.status !== 'cancelled').length} icon={CalendarDays} />
        <StatCard index={1} label="Covers" value={covers} icon={Users} accent="jade" />
        <StatCard index={2} label="Pending" value={rows.filter((r) => r.status === 'pending').length} icon={CalendarClock} accent="amber" />
        <StatCard index={3} label="Unassigned" value={rows.filter((r) => !r.tableId && r.status !== 'cancelled').length} icon={Armchair} accent="red" />
      </div>

      <Card>
        <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="scrollbar-none flex gap-1.5 overflow-x-auto">
            {days.map((d) => (
              <button key={d.iso} onClick={() => setDate(d.iso)} className={cn('flex w-14 shrink-0 flex-col items-center rounded-xl border py-2 transition', date === d.iso ? 'border-gold-400 bg-gold-400/15' : 'border-line hover:border-line-strong')}>
                <span className="text-[10px] font-semibold uppercase text-muted">{d.dow}</span>
                <span className="font-display text-lg font-semibold">{d.day}</span>
              </button>
            ))}
          </div>
          <Segmented size="sm" layoutId="res-view" value={view} onChange={setView} options={[{ value: 'list', label: 'List', icon: List }, { value: 'timeline', label: 'Timeline', icon: GanttChart }]} />
        </div>
        {view === 'list' ? <DataTable columns={columns} rows={rows} /> : <Timeline rows={rows} tables={tables} />}
      </Card>

      <RescheduleModal key={modal?.r?.id ?? 'none'} state={modal} onClose={() => setModal(null)} />
      <AssignModal state={modal} onClose={() => setModal(null)} tables={tables} />
      <NewReservationModal open={modal?.kind === 'new'} onClose={() => setModal(null)} date={date} />
    </>
  )
}

function IconBtn({ icon: Icon, title, onClick, tone }) {
  const tones = { jade: 'hover:bg-jade-500/15 hover:text-jade-500', red: 'hover:bg-lacquer-500/15 hover:text-lacquer-500', gold: 'hover:bg-gold-400/15 hover:text-gold-500' }
  return (
    <button title={title} aria-label={title} onClick={onClick} className={cn('grid size-8 place-items-center rounded-lg text-muted transition', tones[tone] ?? 'hover:bg-surface-2 hover:text-fg')}>
      <Icon className="size-4" />
    </button>
  )
}

/** Gantt-style view: tables × evening hours. */
function Timeline({ rows, tables }) {
  const start = 12 * 60
  const end = 23 * 60 + 30
  const span = end - start
  const hours = Array.from({ length: 12 }, (_, i) => 12 + i)
  return (
    <div className="scrollbar-thin overflow-x-auto p-4">
      <div className="min-w-[860px]">
        <div className="relative ml-16 h-6">
          {hours.map((h) => (
            <span key={h} className="absolute -translate-x-1/2 text-[10px] font-semibold text-muted" style={{ left: `${((h * 60 - start) / span) * 100}%` }}>{to12h(`${h}:00`).replace(':00', '')}</span>
          ))}
        </div>
        {tables.map((t) => (
          <div key={t.id} className="flex items-center border-t border-line">
            <div className="w-16 shrink-0 py-3 text-sm font-semibold">{t.id}<div className="text-[10px] font-normal text-muted">{t.capacity} seats</div></div>
            <div className="relative h-12 flex-1 bg-[repeating-linear-gradient(90deg,transparent,transparent_calc(100%/11.5-1px),var(--line)_calc(100%/11.5-1px),var(--line)_calc(100%/11.5))]">
              {rows.filter((r) => r.tableId === t.id && r.status !== 'cancelled').map((r) => (
                <motion.div key={r.id} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ left: `${((toMin(r.time) - start) / span) * 100}%`, width: `${(90 / span) * 100}%`, originX: 0 }}
                  className={cn('absolute inset-y-1.5 overflow-hidden rounded-lg border px-2 py-1 text-[11px] leading-tight', r.status === 'pending' ? 'border-amber-500/40 bg-amber-500/15' : r.status === 'seated' ? 'border-sky-500/40 bg-sky-500/15' : 'border-jade-500/40 bg-jade-500/15')}>
                  <div className="truncate font-semibold">{r.name}</div>
                  <div className="truncate text-muted">{to12h(r.time)} · {r.guests}p</div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RescheduleModal({ state, onClose }) {
  const update = useReservationsStore((s) => s.update)
  const r = state?.kind === 'reschedule' ? state.r : null
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  return (
    <Modal open={!!r} onClose={onClose} title="Reschedule" description={r ? `${r.name} · ${r.guests} guests` : ''} size="sm"
      footer={<><Button variant="ghost" onClick={onClose}>Close</Button><Button onClick={() => { update(r.id, { date: date || r.date, time: time || r.time }); toast.success('Reservation rescheduled'); onClose() }}>Save</Button></>}>
      {r && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date"><Input type="date" defaultValue={r.date} onChange={(e) => setDate(e.target.value)} /></Field>
          <Field label="Time"><Input type="time" defaultValue={r.time} onChange={(e) => setTime(e.target.value)} /></Field>
        </div>
      )}
    </Modal>
  )
}

function AssignModal({ state, onClose, tables }) {
  const update = useReservationsStore((s) => s.update)
  const r = state?.kind === 'assign' ? state.r : null
  return (
    <Modal open={!!r} onClose={onClose} title="Assign Table" description={r ? `${r.name} · ${r.guests} guests · ${to12h(r.time)}` : ''}>
      {r && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {tables.map((t) => {
            const fits = t.capacity >= r.guests
            return (
              <button key={t.id} disabled={!fits} onClick={() => { update(r.id, { tableId: t.id }); toast.success(`${t.id} assigned to ${r.name}`); onClose() }}
                className={cn('rounded-xl border-2 p-3 text-left transition disabled:opacity-30', r.tableId === t.id ? 'border-gold-400 bg-gold-400/10' : 'border-line hover:border-gold-400/50')}>
                <div className="font-display text-xl font-semibold">{t.id}</div>
                <div className="text-xs text-muted">{t.capacity} seats · {t.zone}</div>
              </button>
            )
          })}
        </div>
      )}
    </Modal>
  )
}

function NewReservationModal({ open, onClose, date }) {
  const create = useReservationsStore((s) => s.create)
  const [f, setF] = useState({ name: '', mobile: '', guests: 2, time: '19:30', seating: 'Indoor', request: '' })
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))
  const save = () => {
    if (!f.name.trim()) return toast.error('Guest name is required')
    const r = create({ ...f, guests: Number(f.guests), date, tableId: null, status: 'confirmed', source: 'phone' })
    toast.success(`${r.code} created for ${r.name}`)
    onClose()
  }
  return (
    <Modal open={open} onClose={onClose} title="New Reservation" description="Phone / walk-in booking"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={save}>Create</Button></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Guest name" required><Input value={f.name} onChange={set('name')} /></Field>
        <Field label="Mobile"><Input value={f.mobile} onChange={set('mobile')} /></Field>
        <Field label="Guests"><Input type="number" min={1} value={f.guests} onChange={set('guests')} /></Field>
        <Field label="Time"><Input type="time" value={f.time} onChange={set('time')} /></Field>
        <Field label="Seating" className="sm:col-span-2">
          <Select value={f.seating} onChange={set('seating')}>{['Indoor', 'Window', 'Private Dining', 'Family Table'].map((s) => <option key={s}>{s}</option>)}</Select>
        </Field>
        <Field label="Special request" className="sm:col-span-2"><Textarea value={f.request} onChange={set('request')} /></Field>
      </div>
    </Modal>
  )
}
