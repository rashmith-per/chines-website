import { lazy } from 'react'
import { BookOpen } from 'lucide-react'
import { defineModule } from '@/core/module/defineModule'

const MenuManagerPage = lazy(() => import('./pages/MenuManagerPage'))

export default defineModule({
  id: 'catalog',
  name: 'Menu Catalog',
  adminRoutes: [{ path: 'menu', element: <MenuManagerPage />, permission: 'menu.manage' }],
  adminNav: [{ path: '/admin/menu', label: 'Menu', icon: BookOpen, group: 'Business', order: 15, permission: 'menu.manage' }],
})
