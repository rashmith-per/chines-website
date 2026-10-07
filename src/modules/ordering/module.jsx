import { lazy } from 'react'
import { ReceiptText } from 'lucide-react'
import { defineModule } from '@/core/module/defineModule'
import { useOrdersStore } from './store/orders.store'

const OrderOnlinePage = lazy(() => import('./pages/OrderOnlinePage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage'))
const OrdersPage = lazy(() => import('./pages/admin/OrdersPage'))

export default defineModule({
  id: 'ordering',
  name: 'Online Ordering',
  publicRoutes: [
    { path: 'order', element: <OrderOnlinePage /> },
    { path: 'checkout', element: <CheckoutPage /> },
    { path: 'track', element: <TrackOrderPage /> },
    { path: 'track/:orderId', element: <TrackOrderPage /> },
  ],
  adminRoutes: [{ path: 'orders', element: <OrdersPage />, permission: 'orders.view' }],
  adminNav: [
    {
      path: '/admin/orders',
      label: 'Orders',
      icon: ReceiptText,
      group: 'Operations',
      order: 20,
      permission: 'orders.view',
      useBadge: () => useOrdersStore((s) => s.orders.filter((o) => o.status === 'received').length),
    },
  ],
})
