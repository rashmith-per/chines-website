/** Permission catalogue — every back-office capability is gated by one of these keys. */
export const PERMISSIONS = [
  { key: 'dashboard.view', label: 'View dashboard', group: 'General' },
  { key: 'orders.view', label: 'View orders', group: 'Orders' },
  { key: 'orders.manage', label: 'Update / cancel orders', group: 'Orders' },
  { key: 'pos.bill', label: 'Create bill', group: 'Billing' },
  { key: 'pos.payment', label: 'Receive payment', group: 'Billing' },
  { key: 'pos.print', label: 'Print bill', group: 'Billing' },
  { key: 'pos.discount', label: 'Apply discounts', group: 'Billing' },
  { key: 'tables.manage', label: 'Table management', group: 'Floor' },
  { key: 'kds.view', label: 'Kitchen display', group: 'Kitchen' },
  { key: 'reservations.manage', label: 'Reservations', group: 'Floor' },
  { key: 'menu.manage', label: 'Menu management', group: 'Admin' },
  { key: 'staff.manage', label: 'Staff & permissions', group: 'Admin' },
  { key: 'inventory.manage', label: 'Inventory', group: 'Admin' },
  { key: 'offers.manage', label: 'Offers & loyalty', group: 'Admin' },
  { key: 'reports.view', label: 'Reports', group: 'Admin' },
  { key: 'hotel.manage', label: 'Hotel / PMS integration', group: 'Admin' },
  { key: 'notifications.manage', label: 'Notifications', group: 'Admin' },
]

const ALL = PERMISSIONS.map((p) => p.key)
const CASHIER = ['dashboard.view', 'pos.bill', 'pos.payment', 'pos.print', 'orders.view']

export const ROLES = [
  { id: 'owner', name: 'Owner / Admin', color: 'red', permissions: ALL, locked: true },
  {
    id: 'manager',
    name: 'Manager',
    color: 'gold',
    permissions: [...CASHIER, 'orders.manage', 'reports.view', 'pos.discount', 'staff.manage', 'menu.manage', 'reservations.manage', 'tables.manage', 'kds.view', 'inventory.manage', 'offers.manage', 'hotel.manage', 'notifications.manage'],
  },
  { id: 'cashier', name: 'Cashier', color: 'jade', permissions: CASHIER },
  { id: 'waiter', name: 'Waiter', color: 'blue', permissions: ['orders.view', 'pos.bill', 'tables.manage', 'reservations.manage'] },
  { id: 'chef', name: 'Chef', color: 'amber', permissions: ['kds.view', 'orders.view', 'inventory.manage', 'menu.manage'] },
  { id: 'kitchen', name: 'Kitchen Staff', color: 'violet', permissions: ['kds.view'] },
  { id: 'delivery', name: 'Delivery Staff', color: 'neutral', permissions: ['orders.view'] },
]

export const STAFF = [
  { id: 's1', name: 'Vikram Reddy', role: 'owner', phone: '98490 11223', email: 'vikram@dragonpearl.in', shift: '10:00 – 22:00', status: 'on-shift', joined: '2019-03-01', rating: 4.9, ordersToday: 0 },
  { id: 's2', name: 'Meera Iyer', role: 'manager', phone: '98490 22334', email: 'meera@dragonpearl.in', shift: '11:00 – 23:00', status: 'on-shift', joined: '2020-06-15', rating: 4.8, ordersToday: 0 },
  { id: 's3', name: 'Sanjay Kumar', role: 'cashier', phone: '98490 33445', email: 'sanjay@dragonpearl.in', shift: '11:00 – 19:00', status: 'on-shift', joined: '2022-01-10', rating: 4.6, ordersToday: 0 },
  { id: 's4', name: 'Ravi Teja', role: 'waiter', phone: '98490 44556', email: 'ravi@dragonpearl.in', shift: '12:00 – 23:30', status: 'on-shift', joined: '2021-09-01', rating: 4.7, ordersToday: 18 },
  { id: 's5', name: 'Anil Verma', role: 'waiter', phone: '98490 55667', email: 'anil@dragonpearl.in', shift: '12:00 – 23:30', status: 'on-shift', joined: '2023-02-20', rating: 4.5, ordersToday: 14 },
  { id: 's6', name: 'Priya Nair', role: 'waiter', phone: '98490 66778', email: 'priya.n@dragonpearl.in', shift: '07:00 – 16:00', status: 'break', joined: '2023-07-11', rating: 4.8, ordersToday: 11 },
  { id: 's7', name: 'Chef Wong Lei', role: 'chef', phone: '98490 77889', email: 'wong@dragonpearl.in', shift: '10:00 – 23:00', status: 'on-shift', joined: '2018-11-05', rating: 5.0, ordersToday: 0 },
  { id: 's8', name: 'Chef Arun Das', role: 'chef', phone: '98490 88990', email: 'arun@dragonpearl.in', shift: '06:30 – 15:30', status: 'off', joined: '2021-04-18', rating: 4.7, ordersToday: 0 },
  { id: 's9', name: 'Lakshmi Rao', role: 'kitchen', phone: '98490 99001', email: 'lakshmi@dragonpearl.in', shift: '10:00 – 22:00', status: 'on-shift', joined: '2022-08-08', rating: 4.6, ordersToday: 0 },
  { id: 's10', name: 'Imran Shaikh', role: 'kitchen', phone: '98491 10112', email: 'imran@dragonpearl.in', shift: '14:00 – 23:30', status: 'on-shift', joined: '2024-01-03', rating: 4.4, ordersToday: 0 },
  { id: 's11', name: 'Kiran Babu', role: 'delivery', phone: '98491 21223', email: 'kiran@dragonpearl.in', shift: '11:00 – 23:00', status: 'on-shift', joined: '2023-05-14', rating: 4.6, ordersToday: 9 },
  { id: 's12', name: 'Suresh Goud', role: 'delivery', phone: '98491 32334', email: 'suresh@dragonpearl.in', shift: '11:00 – 23:00', status: 'off', joined: '2024-03-22', rating: 4.3, ordersToday: 0 },
]
