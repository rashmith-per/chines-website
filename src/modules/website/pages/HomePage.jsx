import { useDocumentTitle } from '@/core/hooks'
import { Hero } from '../sections/Hero'
import { CategoryRail } from '../sections/CategoryRail'
import { WokToTable } from '../sections/WokToTable'
import { DishMarquee, Manifesto, SignatureDishes, Experience, WaysToEnjoy, OffersTeaser, Testimonials } from '../sections/HomeSections'

export default function HomePage() {
  useDocumentTitle('Authentic Chinese Cuisine')
  return (
    <>
      <Hero />
      <DishMarquee />
      <Manifesto />
      <CategoryRail />
      <SignatureDishes />
      <WokToTable />
      <Experience />
      <WaysToEnjoy />
      <OffersTeaser />
      <Testimonials />
    </>
  )
}
