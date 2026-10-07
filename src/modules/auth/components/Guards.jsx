import { Navigate, useLocation } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { EmptyState, Button } from '@/core/ui'
import { useCurrentUser, usePermission } from '../store/session.store'

export function RequireAuth({ children }) {
  const user = useCurrentUser()
  const location = useLocation()
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  return children
}

export function RequirePermission({ permission, children }) {
  const can = usePermission()
  if (can(permission)) return children
  return (
    <EmptyState
      icon={ShieldAlert}
      title="You don't have access to this area"
      description="Your role doesn't include this permission. Ask a manager to update it in Staff → Roles & permissions."
      action={<Button to="/admin" variant="subtle">Back to dashboard</Button>}
      className="min-h-[60vh]"
    />
  )
}

/** Render children only when the current user has `permission`. */
export function Can({ permission, children, fallback = null }) {
  const can = usePermission()
  return can(permission) ? children : fallback
}
