import { MODULES } from './modules.registry'

let disposers = null

/** Lets every module register its domain-event subscriptions exactly once (HMR-safe). */
export function bootstrapModules() {
  if (disposers) return disposers
  disposers = MODULES.map((m) => m.register?.()).filter((d) => typeof d === 'function')
  return disposers
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    disposers?.forEach((d) => d())
    disposers = null
  })
}
