import { lazy } from 'react'
import { TicketPercent } from 'lucide-react'
import { defineModule } from '@/core/module/defineModule'
import { subscribe, publish, EVENTS } from '@/core/events/eventBus'
import { useLoyaltyStore } from './store/offers.store'

const OffersPage = lazy(() => import('./pages/OffersPage'))
const OffersAdminPage = lazy(() => import('./pages/OffersAdminPage'))

export default defineModule({
  id: 'offers-loyalty',
  name: 'Offers & Loyalty',
  publicRoutes: [{ path: 'offers', element: <OffersPage /> }],
  adminRoutes: [{ path: 'offers', element: <OffersAdminPage />, permission: 'offers.manage' }],
  adminNav: [{ path: '/admin/offers', label: 'Offers & Loyalty', icon: TicketPercent, group: 'Business', order: 40, permission: 'offers.manage' }],
  register() {
    // Customers earn Pearl Rewards on every online / room-service order.
    return subscribe(EVENTS.ORDER_PLACED, (order) => {
      if (!['web', 'room-service'].includes(order.source)) return
      const points = useLoyaltyStore.getState().earn(order.pricing.total, `Order ${order.code}`)
      if (points) publish(EVENTS.LOYALTY_POINTS_EARNED, { order, points })
    })
  },
})
