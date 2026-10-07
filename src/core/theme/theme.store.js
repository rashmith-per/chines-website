import { useEffect } from 'react'
import { createPersistedStore } from '@/core/store/createStore'

export const useThemeStore = createPersistedStore('theme', (set) => ({
  adminTheme: 'dark',
  sidebarCollapsed: false,
  toggleAdminTheme: () => set((s) => ({ adminTheme: s.adminTheme === 'dark' ? 'light' : 'dark' })),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}))

/** Applies a colour scheme to <html>. The website is always dark; the back office follows the user's choice. */
export function useApplyTheme(mode) {
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', mode === 'dark')
    root.style.colorScheme = mode
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode === 'dark' ? '#0c0a09' : '#f6f2ec')
  }, [mode])
}
