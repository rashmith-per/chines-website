import { useSearchParams } from 'react-router-dom'
import { Leaf, Flame, Clock } from 'lucide-react'
import { PageHero } from '@/core/ui'
import { Reveal } from '@/core/animation/Reveal'
import { useDocumentTitle } from '@/core/hooks'
import { CATEGORIES } from '@/modules/catalog'
import { MenuBrowser } from '@/modules/ordering'

export default function MenuPage() {
  useDocumentTitle('Menu')
  const [params] = useSearchParams()
  const cat = params.get('cat')
  const initial = CATEGORIES.some((c) => c.id === cat) ? cat : 'all'

  return (
    <>
      <PageHero eyebrow="The Menu" cjk="菜單" title={'A journey through *China*'} subtitle="Cantonese, Sichuan and Shanghainese classics — add anything to your order as you browse." image="spread">
        <div className="mt-8 flex flex-wrap gap-3 text-sm text-pearl-200/80">
          <span className="flex items-center gap-2 rounded-full border border-line bg-ink-950/40 px-4 py-2 backdrop-blur"><Leaf className="size-4 text-jade-400" /> Vegetarian marked</span>
          <span className="flex items-center gap-2 rounded-full border border-line bg-ink-950/40 px-4 py-2 backdrop-blur"><Flame className="size-4 text-lacquer-400" /> Spice levels 1–3</span>
          <span className="flex items-center gap-2 rounded-full border border-line bg-ink-950/40 px-4 py-2 backdrop-blur"><Clock className="size-4 text-gold-400" /> Prep times shown</span>
        </div>
      </PageHero>
      <section className="container-x pb-28">
        <Reveal>
          <MenuBrowser key={initial} initialCategory={initial} />
        </Reveal>
      </section>
    </>
  )
}
