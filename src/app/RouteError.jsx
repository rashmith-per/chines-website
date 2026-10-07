import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Button } from '@/core/ui'

/** Friendly fallback for any route that throws while rendering or loading. */
export default function RouteError() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : error?.message ?? 'Unknown error'
  return (
    <div className="grid min-h-dvh place-items-center bg-bg px-6 text-center text-fg">
      <div className="max-w-md">
        <div className="font-cjk text-8xl text-gradient-gold">誤</div>
        <h1 className="mt-4 font-display text-4xl">Something went wrong</h1>
        <p className="mt-3 text-muted">The kitchen dropped a plate. Try again, or head back home.</p>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-line bg-surface-2 p-3 text-left text-xs text-muted">{message}</pre>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => window.location.reload()}>Reload</Button>
          <Button href="/" variant="outline">Home</Button>
        </div>
      </div>
    </div>
  )
}
