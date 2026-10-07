import { lazy } from 'react'
import { Users } from 'lucide-react'
import { defineModule } from '@/core/module/defineModule'

const StaffPage = lazy(() => import('./pages/StaffPage'))

export default defineModule({
  id: 'staff',
  name: 'Staff Management',
  adminRoutes: [{ path: 'staff', element: <StaffPage />, permission: 'staff.manage' }],
  adminNav: [{ path: '/admin/staff', label: 'Staff', icon: Users, group: 'Business', order: 30, permission: 'staff.manage' }],
})
