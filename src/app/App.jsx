import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { router } from './router'
import { bootstrapModules } from './bootstrap'

bootstrapModules()

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        theme="dark"
        richColors
        closeButton
        toastOptions={{ style: { fontFamily: 'var(--font-sans)', borderRadius: '16px' } }}
      />
    </>
  )
}
