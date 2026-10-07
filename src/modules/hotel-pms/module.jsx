import { lazy } from 'react'
import { Hotel } from 'lucide-react'
import { defineModule } from '@/core/module/defineModule'
import { subscribe, publish, EVENTS } from '@/core/events/eventBus'
import { usePmsStore } from './store/pms.store'

const HotelPmsPage = lazy(() => import('./pages/HotelPmsPage'))

export default defineModule({
  id: 'hotel-pms',
  name: 'Hotel / PMS Integration',
  adminRoutes: [{ path: 'hotel', element: <HotelPmsPage />, permission: 'hotel.manage' }],
  adminNav: [{ path: '/admin/hotel', label: 'Hotel / PMS', icon: Hotel, group: 'Business', order: 60, permission: 'hotel.manage' }],
  register() {
    // Room-charge bridge: any module may request a charge; the PMS adapter posts it to the folio.
    return subscribe(EVENTS.ROOM_CHARGE_REQUESTED, (req) => {
      if (!usePmsStore.getState().settings.autoPost) return
      const result = usePmsStore.getState().postCharge(req)
      publish(EVENTS.ROOM_CHARGE_POSTED, { ...req, ...result })
    })
  },
})
