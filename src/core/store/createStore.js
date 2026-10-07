import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const NAMESPACE = 'dragon-pearl'
const registry = new Set()

/**
 * Factory for module stores. Every persisted store:
 *  - is namespaced in localStorage (`dragon-pearl:<name>`)
 *  - re-hydrates when another tab writes, so the website, POS and KDS stay in sync live
 *  - can be reset globally (demo "reset data" button)
 */
export function createPersistedStore(name, initializer, { version = 1, partialize } = {}) {
  const key = `${NAMESPACE}:${name}`
  const store = create(
    persist(initializer, {
      name: key,
      version,
      storage: createJSONStorage(() => localStorage),
      ...(partialize ? { partialize } : {}),
      migrate: () => undefined, // seed fresh data when the schema version changes
    }),
  )
  registry.add({ key, store })
  return store
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    registry.forEach(({ key, store }) => {
      if (e.key === key) store.persist.rehydrate()
    })
  })
}

/** Wipe all persisted module data and reload with fresh seed data. */
export function resetAllStores() {
  registry.forEach(({ key }) => localStorage.removeItem(key))
  window.location.reload()
}

export { create }
