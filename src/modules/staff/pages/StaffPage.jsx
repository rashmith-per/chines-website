import { Fragment, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Plus, Phone, Mail, Star, Lock, Users, UserCheck, Coffee, ShieldCheck, Pencil } from 'lucide-react'
import { PageHeader, Card, Button, Badge, Avatar, Segmented, Modal, Field, Input, Select, StatCard } from '@/core/ui'
import { cn } from '@/core/lib/cn'
import { useDocumentTitle } from '@/core/hooks'
import { useStaffStore } from '../store/staff.store'
import { PERMISSIONS } from '../data/staff.data'

const STATUS = { 'on-shift': ['On shift', 'jade'], break: ['On break', 'amber'], off: ['Off duty', 'neutral'] }

export default function StaffPage() {
  useDocumentTitle('Staff')
  const { staff, roles } = useStaffStore()
  const [tab, setTab] = useState('team')
  const [editing, setEditing] = useState(null)
  const [roleFilter, setRoleFilter] = useState('all')

  return (
    <>
      <PageHeader title="Staff Management" cjk="員工" subtitle="Team, roles and granular permissions for every member of the restaurant."
        actions={<Button icon={Plus} onClick={() => setEditing({})}>Add staff</Button>} />
      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard index={0} label="Team members" value={staff.length} icon={Users} />
        <StatCard index={1} label="On shift" value={staff.filter((s) => s.status === 'on-shift').length} icon={UserCheck} accent="jade" />
        <StatCard index={2} label="On break" value={staff.filter((s) => s.status === 'break').length} icon={Coffee} accent="amber" />
        <StatCard index={3} label="Roles" value={roles.length} icon={ShieldCheck} accent="violet" />
      </div>
      <Segmented layoutId="staff-tab" value={tab} onChange={setTab} className="mb-5" options={[{ value: 'team', label: 'Team' }, { value: 'roster', label: "Today's roster" }, { value: 'permissions', label: 'Roles & permissions' }]} />

      {tab === 'team' && (
        <>
          <div className="scrollbar-none mb-4 flex gap-1.5 overflow-x-auto">
            {[{ id: 'all', name: 'All' }, ...roles].map((r) => (
              <button key={r.id} onClick={() => setRoleFilter(r.id)} className={cn('shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold', roleFilter === r.id ? 'bg-fg text-bg' : 'bg-surface-2 text-muted')}>{r.name}</button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {staff.filter((s) => roleFilter === 'all' || s.role === roleFilter).map((m, i) => <StaffCard key={m.id} member={m} index={i} onEdit={() => setEditing(m)} />)}
          </div>
        </>
      )}
      {tab === 'roster' && <Roster />}
      {tab === 'permissions' && <PermissionMatrix />}
      <StaffModal key={editing?.id ?? 'new'} member={editing} onClose={() => setEditing(null)} />
    </>
  )
}

function StaffCard({ member, index, onEdit }) {
  const { roleOf, setStatus } = useStaffStore()
  const role = roleOf(member.role)
  const [label, tone] = STATUS[member.status]
  const cycle = () => setStatus(member.id, member.status === 'on-shift' ? 'break' : member.status === 'break' ? 'off' : 'on-shift')
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
      <Card hover className="group relative p-5">
        <button onClick={onEdit} className="absolute right-4 top-4 rounded-lg p-1.5 text-muted opacity-0 transition hover:bg-surface-2 group-hover:opacity-100" aria-label="Edit"><Pencil className="size-4" /></button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar name={member.name} size="lg" />
            <span className={cn('absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-surface', member.status === 'on-shift' ? 'bg-jade-500' : member.status === 'break' ? 'bg-amber-500' : 'bg-neutral-400')} />
          </div>
          <div className="min-w-0">
            <div className="truncate font-semibold">{member.name}</div>
            <Badge tone={role?.color}>{role?.name}</Badge>
          </div>
        </div>
        <div className="mt-4 space-y-1.5 text-sm text-muted">
          <div className="flex items-center gap-2"><Phone className="size-3.5" />{member.phone}</div>
          <div className="flex items-center gap-2 truncate"><Mail className="size-3.5" />{member.email}</div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs">
          <span className="text-muted">Shift {member.shift}</span>
          <span className="flex items-center gap-1 font-semibold"><Star className="size-3.5 fill-gold-400 text-gold-400" />{member.rating}</span>
        </div>
        <button onClick={cycle} className="mt-3 w-full"><Badge tone={tone} dot className="w-full justify-center py-1">{label} · tap to change</Badge></button>
      </Card>
    </motion.div>
  )
}

function Roster() {
  const { staff, roleOf } = useStaffStore()
  const start = 6
  const end = 24
  const pos = (t) => { const [h, m] = t.split(':').map(Number); return ((h + m / 60 - start) / (end - start)) * 100 }
  const nowPct = ((new Date().getHours() + new Date().getMinutes() / 60 - start) / (end - start)) * 100
  return (
    <Card className="scrollbar-thin overflow-x-auto p-5">
      <div className="min-w-[760px]">
        <div className="relative ml-44 h-6 text-[10px] font-semibold text-muted">
          {Array.from({ length: 10 }, (_, i) => start + i * 2).map((h) => <span key={h} className="absolute -translate-x-1/2" style={{ left: `${((h - start) / (end - start)) * 100}%` }}>{h}:00</span>)}
        </div>
        <div className="relative">
          {nowPct > 0 && nowPct < 100 && <div className="absolute bottom-0 top-0 z-10 ml-44 w-[calc(100%-11rem)]"><div className="absolute bottom-0 top-0 w-px bg-lacquer-500" style={{ left: `${nowPct}%` }}><span className="absolute -top-1 -translate-x-1/2 rounded bg-lacquer-500 px-1 text-[9px] font-bold text-white">NOW</span></div></div>}
          {staff.map((m, i) => {
            const [a, b] = m.shift.split('–').map((s) => s.trim())
            const role = roleOf(m.role)
            return (
              <div key={m.id} className="flex items-center border-t border-line py-2">
                <div className="flex w-44 shrink-0 items-center gap-2"><Avatar name={m.name} size="sm" /><div className="min-w-0"><div className="truncate text-sm font-medium">{m.name}</div><div className="text-[10px] text-muted">{role?.name}</div></div></div>
                <div className="relative h-8 flex-1 rounded-lg bg-surface-2/50">
                  <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: i * 0.03, duration: 0.6 }} style={{ left: `${pos(a)}%`, width: `${pos(b) - pos(a)}%`, originX: 0 }}
                    className={cn('absolute inset-y-1 rounded-md px-2 text-[11px] font-semibold leading-6', m.status === 'off' ? 'bg-surface-3 text-muted' : 'bg-gradient-to-r from-gold-300/80 to-gold-500/80 text-ink-950')}>
                    {m.shift}
                  </motion.div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

function PermissionMatrix() {
  const { roles, togglePermission } = useStaffStore()
  const groups = [...new Set(PERMISSIONS.map((p) => p.group))]
  return (
    <Card className="scrollbar-thin overflow-x-auto">
      <table className="w-full min-w-[860px] text-sm">
        <thead>
          <tr className="border-b border-line">
            <th className="sticky left-0 bg-surface px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Permission</th>
            {roles.map((r) => (
              <th key={r.id} className="px-3 py-4 text-center"><Badge tone={r.color}>{r.locked && <Lock className="size-3" />}{r.name}</Badge></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <Fragment key={g}>
              <tr><td colSpan={roles.length + 1} className="bg-surface-2/60 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">{g}</td></tr>
              {PERMISSIONS.filter((p) => p.group === g).map((p) => (
                <tr key={p.key} className="border-b border-line hover:bg-surface-2/30">
                  <td className="sticky left-0 bg-surface px-5 py-3 font-medium">{p.label}</td>
                  {roles.map((r) => {
                    const on = r.permissions.includes(p.key)
                    return (
                      <td key={r.id} className="px-3 py-3 text-center">
                        <button disabled={r.locked} onClick={() => { togglePermission(r.id, p.key); toast(`${r.name}: ${p.label} ${on ? 'revoked' : 'granted'}`) }}
                          className={cn('mx-auto grid size-7 place-items-center rounded-lg border-2 transition', on ? 'border-jade-500 bg-jade-500 text-white' : 'border-line-strong hover:border-jade-500/60', r.locked && 'cursor-not-allowed opacity-60')} aria-label={`${p.label} for ${r.name}`}>
                          {on && <motion.svg initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3"><motion.path d="M5 12l5 5L20 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /></motion.svg>}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

function StaffModal({ member, onClose }) {
  const { roles, upsertStaff, removeStaff } = useStaffStore()
  const [f, setF] = useState({ name: '', role: 'waiter', phone: '', email: '', shift: '12:00 – 23:00', ...member })
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))
  const isEdit = !!member?.id
  return (
    <Modal open={!!member} onClose={onClose} title={isEdit ? 'Edit staff member' : 'Add staff member'}
      footer={<>{isEdit && <Button variant="danger" className="mr-auto" onClick={() => { removeStaff(member.id); toast('Staff member removed'); onClose() }}>Remove</Button>}<Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={() => { if (!f.name) return toast.error('Name is required'); upsertStaff(f); toast.success(isEdit ? 'Saved' : `${f.name} added to the team`); onClose() }}>Save</Button></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" required className="sm:col-span-2"><Input value={f.name} onChange={set('name')} /></Field>
        <Field label="Role"><Select value={f.role} onChange={set('role')}>{roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</Select></Field>
        <Field label="Shift"><Input value={f.shift} onChange={set('shift')} placeholder="12:00 – 23:00" /></Field>
        <Field label="Phone"><Input value={f.phone} onChange={set('phone')} /></Field>
        <Field label="Email"><Input value={f.email} onChange={set('email')} /></Field>
      </div>
    </Modal>
  )
}
