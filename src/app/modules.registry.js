/**
 * The single place where feature modules are plugged into the monolith.
 * Add a module here and its routes, navigation and event handlers are wired automatically.
 */
import website from '@/modules/website/module'
import catalog from '@/modules/catalog/module'
import ordering from '@/modules/ordering/module'
import reservations from '@/modules/reservations/module'
import roomService from '@/modules/room-service/module'
import offersLoyalty from '@/modules/offers-loyalty/module'
import account from '@/modules/account/module'
import auth from '@/modules/auth/module'
import adminShell from '@/modules/admin-shell/module'
import pos from '@/modules/pos/module'
import tables from '@/modules/tables/module'
import kds from '@/modules/kds/module'
import staff from '@/modules/staff/module'
import inventory from '@/modules/inventory/module'
import reports from '@/modules/reports/module'
import hotelPms from '@/modules/hotel-pms/module'
import notifications from '@/modules/notifications/module'

export const MODULES = [
  website,
  catalog,
  ordering,
  reservations,
  roomService,
  offersLoyalty,
  account,
  auth,
  adminShell,
  pos,
  tables,
  kds,
  staff,
  inventory,
  reports,
  hotelPms,
  notifications,
]

export const ADMIN_NAV = MODULES.flatMap((m) => m.adminNav).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
