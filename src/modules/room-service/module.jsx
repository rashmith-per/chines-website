import { lazy } from 'react'
import { defineModule } from '@/core/module/defineModule'

const RoomServicePage = lazy(() => import('./pages/RoomServicePage'))

export default defineModule({
  id: 'room-service',
  name: 'Hotel Room Service',
  publicRoutes: [{ path: 'room-service', element: <RoomServicePage /> }],
})
