import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { MapPin, Phone, Mail, MessageCircle, Send, Clock } from 'lucide-react'
import { PageHero, Button, Field, Input, Textarea, Select } from '@/core/ui'
import { Reveal, RevealGroup, RevealItem } from '@/core/animation/Reveal'
import { sleep } from '@/core/lib/id'
import { useDocumentTitle } from '@/core/hooks'
import { APP_CONFIG } from '@/core/config/app.config'

export default function ContactPage() {
  useDocumentTitle('Contact')
  const { brand, timings } = APP_CONFIG
  const [f, setF] = useState({ name: '', email: '', topic: 'General enquiry', message: '' })
  const [sending, setSending] = useState(false)
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!f.name || !f.message) return toast.error('Please add your name and a message')
    setSending(true)
    await sleep(900)
    setSending(false)
    setF({ name: '', email: '', topic: 'General enquiry', message: '' })
    toast.success('Message sent', { description: 'Our team will get back to you within a few hours.' })
  }

  const cards = [
    { icon: MapPin, label: 'Visit', value: brand.address.line1, sub: brand.address.line2, href: brand.address.mapsUrl },
    { icon: Phone, label: 'Call', value: brand.phone, sub: 'Reservations & orders', href: `tel:${brand.phone}` },
    { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with us', sub: 'Quick replies, 11 AM – 11 PM', href: `https://wa.me/${brand.whatsapp}` },
    { icon: Mail, label: 'Email', value: brand.email, sub: 'Events & private dining', href: `mailto:${brand.email}` },
  ]

  return (
    <>
      <PageHero eyebrow="Contact" cjk="聯繫" title={'Let’s *talk* food'} subtitle="Private dining, large parties, feedback or just a question about the menu." image="interiorWarm" />
      <section className="container-x pb-24">
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <RevealItem key={c.label}>
              <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="group block h-full rounded-[2rem] border border-line bg-surface/60 p-6 transition-all hover:-translate-y-1 hover:border-gold-400/40">
                <c.icon className="size-6 text-gold-400 transition-transform group-hover:scale-110" />
                <div className="mt-5 text-[11px] font-bold uppercase tracking-[0.24em] text-muted">{c.label}</div>
                <div className="mt-1 font-semibold">{c.value}</div>
                <div className="text-sm text-muted">{c.sub}</div>
              </a>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_1.1fr]">
          <Reveal>
            <form onSubmit={submit} className="space-y-4 rounded-[2rem] border border-line bg-surface/70 p-7">
              <h2 className="font-display text-3xl">Send us a message</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" required><Input value={f.name} onChange={set('name')} /></Field>
                <Field label="Email"><Input type="email" value={f.email} onChange={set('email')} /></Field>
              </div>
              <Field label="Topic"><Select value={f.topic} onChange={set('topic')}>{['General enquiry', 'Private dining & events', 'Feedback', 'Catering', 'Careers'].map((t) => <option key={t}>{t}</option>)}</Select></Field>
              <Field label="Message" required><Textarea rows={5} value={f.message} onChange={set('message')} /></Field>
              <Button type="submit" size="lg" loading={sending} icon={sending ? undefined : Send} className="w-full">Send message</Button>
            </form>
          </Reveal>
          <Reveal delay={1} className="flex flex-col gap-5">
            <motion.div className="relative min-h-80 flex-1 overflow-hidden rounded-[2rem] border border-line">
              <iframe title="Dragon Pearl location" src="https://www.google.com/maps?q=Banjara+Hills+Hyderabad&output=embed" className="absolute inset-0 size-full grayscale invert-[0.92] hue-rotate-180 contrast-[0.9]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </motion.div>
            <div className="rounded-[2rem] border border-line bg-surface/60 p-6">
              <h3 className="flex items-center gap-2 font-display text-xl"><Clock className="size-5 text-gold-400" /> Opening hours</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {timings.map((t) => <div key={t.label} className="rounded-xl bg-surface-2/60 p-3"><div className="text-xs text-muted">{t.label}</div><div className="text-sm font-semibold">{t.time}</div></div>)}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
