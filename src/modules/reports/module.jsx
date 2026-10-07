import { lazy } from 'react'
import { LineChart } from 'lucide-react'
import { defineModule } from '@/core/module/defineModule'

const ReportsPage = lazy(() => import('./pages/ReportsPage'))

export default defineModule({
  id: 'reports',
  name: 'Sales & Billing Reports',
  adminRoutes: [{ path: 'reports', element: <ReportsPage />, permission: 'reports.view' }],
  adminNav: [{ path: '/admin/reports', label: 'Reports', icon: LineChart, group: 'Business', order: 10, permission: 'reports.view' }],
})
