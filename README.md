# Dragon Pearl — Restaurant Website & Management System (Front-end)

React 19 + Vite front-end for the Dragon Pearl Chinese restaurant: a scrollytelling customer website and a full back-office (POS, KDS, tables, reservations, inventory, staff, offers, reports, hotel PMS, notifications). Front-end only — all data is seeded and saved in `localStorage`, and it syncs live between browser tabs.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
```

- **Website:** `/` · `/menu` · `/about` · `/reservations` · `/order` · `/checkout` · `/track/:id` · `/room-service` · `/offers` · `/account` · `/contact`
- **Back office:** `/admin` (pick any demo staff profile; any 4-digit PIN works). Each role only sees what its permissions allow.
- **Reset demo data:** sidebar → *Reset demo data*.

> Tip: open the website in one tab and `/admin/kds` in another. Orders placed online appear on the kitchen screen right away, and moving a ticket forward updates the customer's tracking page.

## Stack
React 19 · React Router 7 · Tailwind CSS 4 · Framer Motion · Lenis (smooth scroll) · Zustand (persisted stores) · Recharts · Sonner · Lucide.

## Architecture — modular monolith

```
src/
├─ app/                     # composition root
│  ├─ modules.registry.js   # ← the only place modules are plugged in
│  ├─ router.jsx            # builds routes + admin nav from module manifests
│  ├─ bootstrap.js          # runs each module's register() (event subscriptions)
│  └─ App.jsx / RouteError.jsx
├─ core/                    # shared kernel — no business logic
│  ├─ config/               # brand, pricing (GST 18%), order types, chart palette
│  ├─ events/eventBus.js    # domain events (publish/subscribe)
│  ├─ store/createStore.js  # namespaced, persisted, cross-tab-synced Zustand factory
│  ├─ module/defineModule.js# module contract
│  ├─ animation/            # Lenis SmoothScroll, Reveal, SplitText, scroll-lit text, Magnetic, Parallax, Marquee…
│  ├─ ui/                   # design-system components (Button, Card, Modal, Drawer, DataTable…)
│  ├─ charts/ hooks/ lib/ theme/
└─ modules/
   ├─ website/        # public layout + Home / Menu / About / Contact
   ├─ catalog/        # menu domain + admin menu manager
   ├─ ordering/       # cart, orders, pricing engine, checkout, tracking, admin orders
   ├─ reservations/   # booking + availability + admin timeline
   ├─ tables/         # floor plan & table status
   ├─ kds/            # kitchen display system
   ├─ pos/            # billing, receipts, payments, WhatsApp share
   ├─ room-service/   # hotel guest in-room dining
   ├─ hotel-pms/      # PMS bridge, guest folios, room charges
   ├─ offers-loyalty/ # offers, coupons, Pearl Rewards
   ├─ account/        # customer account
   ├─ inventory/      # stock, auto-deduction, low-stock alerts
   ├─ staff/          # team, roles & permission matrix, roster
   ├─ auth/           # staff session, guards, login
   ├─ notifications/  # customer & restaurant alerts, channel matrix
   ├─ reports/        # sales & billing reports
   └─ admin-shell/    # back-office layout, ⌘K palette, dashboard
```

Every module has the same layout:

| File | Role |
|---|---|
| `module.jsx` | Manifest: `publicRoutes`, `adminRoutes` (with `permission`), `adminNav`, `register()` |
| `index.js` | Public API — the **only** thing other modules may import |
| `store/ data/ services/ components/ pages/` | Internals |

**How modules talk to each other.** Modules communicate through domain events, not direct calls. For example, `placeOrder()` publishes `order.placed`, and each interested module reacts on its own:

- **inventory** deducts stock and may raise `inventory.low`
- **tables** seats the table
- **offers-loyalty** awards points
- **account** records the order in the customer's history
- **notifications** sends alerts
- a room charge raises `pms.roomChargeRequested`, and **hotel-pms** posts it to the guest folio

**Adding a module.** Create `modules/<name>/module.jsx` with `defineModule({...})` and add it to `app/modules.registry.js`. Its routes, sidebar entry, permission guard and event handlers are then wired up automatically.
