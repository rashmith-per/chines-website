import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { WebsiteLayout } from '@/modules/website'
import { AdminLayout } from '@/modules/admin-shell'
import { RequireAuth, RequirePermission } from '@/modules/auth'
import { MODULES, ADMIN_NAV } from './modules.registry'
import RouteError from './RouteError'

const NotFoundPage = lazy(() => import('@/modules/website/pages/NotFoundPage'))

/** Wrap admin routes in their permission guard declared by the module manifest. */
const guard = ({ permission, element, ...route }) => ({
  ...route,
  element: permission ? <RequirePermission permission={permission}>{element}</RequirePermission> : element,
})

const withSuspense = (route) => ({ ...route, element: <Suspense fallback={null}>{route.element}</Suspense> })

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WebsiteLayout />,
    errorElement: <RouteError />,
    children: MODULES.flatMap((m) => m.publicRoutes),
  },
  {
    path: '/admin',
    errorElement: <RouteError />,
    element: (
      <RequireAuth>
        <AdminLayout nav={ADMIN_NAV} />
      </RequireAuth>
    ),
    children: MODULES.flatMap((m) => m.adminRoutes).map(guard),
  },
  ...MODULES.flatMap((m) => m.standaloneRoutes).map(withSuspense),
  { path: '*', element: <Suspense fallback={null}><NotFoundPage /></Suspense> },
])
