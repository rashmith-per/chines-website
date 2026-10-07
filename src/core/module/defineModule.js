/**
 * Module contract for the modular monolith.
 *
 * Each feature module ships a `module.jsx` manifest describing what it contributes to the
 * application shell, and an `index.js` public API (stores, services, components) that other
 * modules may import. Modules never reach into each other's internals — only `@/modules/<id>`.
 *
 * @typedef {Object} ModuleManifest
 * @property {string} id
 * @property {string} name
 * @property {import('react-router-dom').RouteObject[]} [publicRoutes]  mounted under the website layout
 * @property {import('react-router-dom').RouteObject[]} [adminRoutes]   mounted under /admin
 * @property {import('react-router-dom').RouteObject[]} [standaloneRoutes] mounted at the root with no layout
 * @property {Array<{path:string,label:string,icon:any,permission?:string,group:string,order?:number,badge?:Function}>} [adminNav]
 * @property {() => (void|(() => void))} [register]  wire event subscriptions; may return a disposer
 */
export function defineModule(manifest) {
  if (!manifest?.id) throw new Error('defineModule: `id` is required')
  return Object.freeze({ publicRoutes: [], adminRoutes: [], standaloneRoutes: [], adminNav: [], ...manifest })
}
