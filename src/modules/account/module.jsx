import { lazy } from 'react'
import { defineModule } from '@/core/module/defineModule'
import { subscribe, EVENTS } from '@/core/events/eventBus'
import { useAccountStore } from './store/account.store'

const AccountPage = lazy(() => import('./pages/AccountPage'))

export default defineModule({
  id: 'account',
  name: 'Customer Account',
  publicRoutes: [{ path: 'account', element: <AccountPage /> }],
  register() {
    const offOrder = subscribe(EVENTS.ORDER_PLACED, (o) => {
      if (['web', 'room-service'].includes(o.source)) useAccountStore.getState().trackOrder(o.id)
    })
    const offRes = subscribe(EVENTS.RESERVATION_CREATED, (r) => {
      if (r.source === 'website') useAccountStore.getState().trackReservation(r.id)
    })
    return () => {
      offOrder()
      offRes()
    }
  },
})
