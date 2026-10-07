import { lazy } from 'react'
import { defineModule } from '@/core/module/defineModule'

const LoginPage = lazy(() => import('./pages/LoginPage'))

export default defineModule({
  id: 'auth',
  name: 'Staff Authentication',
  standaloneRoutes: [{ path: '/admin/login', element: <LoginPage /> }],
})
