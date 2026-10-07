import { lazy } from 'react'
import { MonitorSmartphone } from 'lucide-react'
import { defineModule } from '@/core/module/defineModule'

const PosPage = lazy(() => import('./pages/PosPage'))

export default defineModule({
  id: 'pos',
  name: 'POS & Billing',
  adminRoutes: [{ path: 'pos', element: <PosPage />, permission: 'pos.bill' }],
  adminNav: [{ path: '/admin/pos', label: 'POS & Billing', icon: MonitorSmartphone, group: 'Operations', order: 10, permission: 'pos.bill' }],
})
