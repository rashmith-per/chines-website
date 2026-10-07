import { lazy } from 'react'
import { LayoutDashboard } from 'lucide-react'
import { defineModule } from '@/core/module/defineModule'

const DashboardPage = lazy(() => import('./pages/DashboardPage'))

export default defineModule({
  id: 'admin-shell',
  name: 'Admin Dashboard',
  adminRoutes: [{ index: true, element: <DashboardPage />, permission: 'dashboard.view' }],
  adminNav: [{ path: '/admin', label: 'Dashboard', icon: LayoutDashboard, group: 'Overview', order: 0, permission: 'dashboard.view' }],
})
