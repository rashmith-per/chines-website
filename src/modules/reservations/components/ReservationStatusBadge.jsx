import { Badge } from '@/core/ui'

const META = {
  confirmed: ['Confirmed', 'jade'],
  pending: ['Pending', 'amber'],
  seated: ['Seated', 'blue'],
  completed: ['Completed', 'neutral'],
  cancelled: ['Cancelled', 'red'],
}

export function ReservationStatusBadge({ status }) {
  const [label, tone] = META[status] ?? [status, 'neutral']
  return (
    <Badge tone={tone} dot>
      {label}
    </Badge>
  )
}
