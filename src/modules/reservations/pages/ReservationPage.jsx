import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import { CalendarDays, Clock, Users, Search, CheckCircle2, ArrowLeft, Armchair, Sparkles, Phone } from 'lucide-react'
import { PageHero, Button, Field, Input, Select, Textarea, SmartImage } from '@/core/ui'
import { Reveal } from '@/core/animation/Reveal'
import { cn } from '@/core/lib/cn'
import { img } from '@/core/lib/image'
import { formatDate, to12h, todayISO } from '@/core/lib/format'
import { sleep } from '@/core/lib/id'
import { useDocumentTitle } from '@/core/hooks'
import { APP_CONFIG } from '@/core/config/app.config'
import { useReservationsStore } from '../store/reservations.store'

const SEATING = ['Indoor', 'Window', 'Private Dining', 'Family Table']
const SLOTS = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00']

export default function ReservationPage() {
  useDocumentTitle('Reservations')
  const checkAvailability = useReservationsStore((s) => s.checkAvailability)
  const create = useReservationsStore((s) => s.create)
  const [form, setForm] = useState({ name: '', mobile: '', email: '', date: todayISO(), time: '19:30', guests: 4, seating: 'Indoor', request: '' })
  const [step, setStep] = useState('form') // form → tables → done
  const [tables, setTables] = useState([])
  const [tableId, setTableId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [booking, setBooking] = useState(null)
  const [errors, setErrors] = useState({})
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const check = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (form.mobile.replace(/\D/g, '').length < 10) errs.mobile = 'Enter a valid mobile number'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    await sleep(900)
    const result = checkAvailability({ ...form, guests: Number(form.guests) })
    setTables(result)
    setTableId(result[0]?.id ?? null)
    setLoading(false)
    setStep('tables')
  }

  const reserve = async () => {
    setLoading(true)
    await sleep(700)
    const r = create({ ...form, guests: Number(form.guests), tableId, status: 'confirmed' })
    setBooking(r)
    setLoading(false)
    setStep('done')
    toast.success('Table reserved!', { description: `Confirmation ${r.code} sent via SMS & WhatsApp.` })
  }

  return (
    <>
      <PageHero eyebrow="Reservations" cjk="訂位" title={'Reserve *Your* Table'} subtitle="Book your dining experience in advance — window views, family tables and private dining rooms." image="interiorDark" />

      <section className="container-x pb-28 pt-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <Reveal className="relative overflow-hidden rounded-3xl border border-line bg-surface/80 p-6 backdrop-blur-xl sm:p-8">
            <AnimatePresence mode="wait">
              {step === 'form' && (
                <motion.form key="form" onSubmit={check} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
                  <h2 className="font-display text-3xl">Your details</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full Name" required error={errors.name}><Input value={form.name} onChange={set('name')} placeholder="Your name" /></Field>
                    <Field label="Mobile Number" required error={errors.mobile}><Input value={form.mobile} onChange={set('mobile')} inputMode="tel" placeholder="98765 43210" /></Field>
                    <Field label="Email" className="sm:col-span-2"><Input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" /></Field>
                    <Field label="Date" required><Input icon={CalendarDays} type="date" min={todayISO()} value={form.date} onChange={set('date')} /></Field>
                    <Field label="Time" required>
                      <Select value={form.time} onChange={set('time')}>
                        {SLOTS.map((s) => <option key={s} value={s}>{to12h(s)}</option>)}
                      </Select>
                    </Field>
                    <Field label="Number of Guests" required>
                      <Select value={form.guests} onChange={set('guests')}>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}
                      </Select>
                    </Field>
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Seating Preference</div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {SEATING.map((s) => (
                        <button type="button" key={s} onClick={() => setForm((f) => ({ ...f, seating: s }))} className={cn('rounded-xl border px-3 py-3 text-sm font-semibold transition', form.seating === s ? 'border-gold-400 bg-gold-400/15 text-gold-200' : 'border-line text-muted hover:border-line-strong hover:text-fg')}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Field label="Special Request"><Textarea value={form.request} onChange={set('request')} placeholder="Birthday, anniversary, allergies, high chair…" /></Field>
                  <Button type="submit" size="lg" className="w-full" loading={loading} icon={loading ? undefined : Search}>
                    Check Availability
                  </Button>
                </motion.form>
              )}

              {step === 'tables' && (
                <motion.div key="tables" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
                  <button onClick={() => setStep('form')} className="mb-4 flex items-center gap-1.5 text-sm text-muted hover:text-fg"><ArrowLeft className="size-4" /> Edit details</button>
                  <h2 className="font-display text-3xl">Available Tables</h2>
                  <p className="mt-1 text-sm text-muted">{formatDate(form.date)} · {to12h(form.time)} · {form.guests} guests · {form.seating}</p>
                  {tables.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-dashed border-line-strong p-8 text-center">
                      <p className="font-semibold">We're fully booked for that slot.</p>
                      <p className="mt-1 text-sm text-muted">Try another time, or call us on {APP_CONFIG.brand.phone}.</p>
                    </div>
                  ) : (
                    <div className="mt-6 overflow-hidden rounded-2xl border border-line">
                      <div className="grid grid-cols-[minmax(0,1fr)_1fr_1.4fr_1fr] bg-surface-2/60 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                        <span>Table</span><span>Capacity</span><span>Location</span><span>Status</span>
                      </div>
                      {tables.map((t, i) => (
                        <motion.button key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} onClick={() => setTableId(t.id)}
                          className={cn('grid w-full grid-cols-[minmax(0,1fr)_1fr_1.4fr_1fr] items-center border-t border-line px-4 py-3.5 text-left text-sm transition', tableId === t.id ? 'bg-gold-400/12' : 'hover:bg-surface-2/50')}>
                          <span className="flex items-center gap-2 font-display text-lg font-semibold">
                            <span className={cn('grid size-5 place-items-center rounded-full border-2', tableId === t.id ? 'border-gold-400' : 'border-line-strong')}>
                              {tableId === t.id && <span className="size-2.5 rounded-full bg-gold-400" />}
                            </span>
                            {t.id}
                          </span>
                          <span className="flex items-center gap-1.5"><Users className="size-3.5 text-muted" /> {t.capacity}</span>
                          <span>{t.zone}{t.zone === ({ 'Family Table': 'Family Area' }[form.seating] ?? form.seating) && <Sparkles className="ml-1 inline size-3.5 text-gold-400" />}</span>
                          <span className="text-jade-400">Available</span>
                        </motion.button>
                      ))}
                    </div>
                  )}
                  <Button size="lg" className="mt-6 w-full" disabled={!tableId} loading={loading} onClick={reserve} icon={loading ? undefined : Armchair}>
                    Reserve Table {tableId}
                  </Button>
                </motion.div>
              )}

              {step === 'done' && booking && (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center">
                  <motion.div initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.1 }} className="mx-auto grid size-20 place-items-center rounded-full bg-jade-500/15 text-jade-300">
                    <CheckCircle2 className="size-10" />
                  </motion.div>
                  <h2 className="mt-6 font-display text-4xl">See you soon, {booking.name.split(' ')[0]}!</h2>
                  <p className="mt-2 text-muted">Your table is reserved. A confirmation has been sent to {booking.mobile}.</p>
                  <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-3 text-left">
                    {[
                      ['Booking', booking.code],
                      ['Table', booking.tableId],
                      ['Date', formatDate(booking.date)],
                      ['Time', to12h(booking.time)],
                      ['Guests', booking.guests],
                      ['Seating', booking.seating],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-xl border border-line bg-surface-2/50 p-3">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">{k}</div>
                        <div className="mt-0.5 font-semibold">{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-center gap-3">
                    <Button variant="outline" onClick={() => { setStep('form'); setBooking(null) }}>New reservation</Button>
                    <Button to="/menu" variant="gold">Preview the menu</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Reveal>

          <Reveal delay={1} className="space-y-5">
            <div className="relative overflow-hidden rounded-3xl">
              <SmartImage src={img('fineDining', { w: 900, h: 1000 })} alt="Dining room" className="aspect-[4/4.4]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="font-cjk text-3xl text-gold-300">歡迎</div>
                <p className="mt-2 font-display text-2xl text-pearl-50">A premium Chinese dining experience inside {APP_CONFIG.brand.hotel}.</p>
              </div>
            </div>
            <div className="rounded-3xl border border-line bg-surface/70 p-6">
              <h3 className="flex items-center gap-2 font-display text-xl"><Clock className="size-5 text-gold-400" /> Restaurant Timings</h3>
              <div className="mt-4 divide-y divide-line">
                {APP_CONFIG.timings.map((t) => (
                  <div key={t.label} className="flex justify-between py-2.5 text-sm"><span className="text-muted">{t.label}</span><span className="font-semibold">{t.time}</span></div>
                ))}
              </div>
              <a href={`tel:${APP_CONFIG.brand.phone}`} className="mt-4 flex items-center gap-2 text-sm text-gold-300 hover:underline"><Phone className="size-4" /> Large party? Call {APP_CONFIG.brand.phone}</a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
