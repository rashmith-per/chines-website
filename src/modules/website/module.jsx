import { lazy } from 'react'
import { defineModule } from '@/core/module/defineModule'

const HomePage = lazy(() => import('./pages/HomePage'))
const MenuPage = lazy(() => import('./pages/MenuPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))

/** Marketing / content pages of the customer website. */
export default defineModule({
  id: 'website',
  name: 'Customer Website',
  publicRoutes: [
    { index: true, element: <HomePage /> },
    { path: 'menu', element: <MenuPage /> },
    { path: 'about', element: <AboutPage /> },
    { path: 'contact', element: <ContactPage /> },
  ],
})
