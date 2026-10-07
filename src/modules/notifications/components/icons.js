import { ShoppingBag, CalendarCheck, Wallet, XCircle, PackageX, Clock, CheckCircle2, Bike, Receipt, BellRing, Megaphone, Globe, MessageSquare, Mail, MessageCircle, Smartphone } from 'lucide-react'

export const KIND_ICON = {
  'new-order': ShoppingBag,
  'new-reservation': CalendarCheck,
  'payment-received': Wallet,
  cancellation: XCircle,
  'low-inventory': PackageX,
  'pending-orders': Clock,
  'booking-confirmation': CalendarCheck,
  'order-confirmation': Receipt,
  'order-ready': CheckCircle2,
  'delivery-update': Bike,
  'payment-receipt': Receipt,
  'reservation-reminder': BellRing,
  'special-offers': Megaphone,
}

export const CHANNEL_ICON = { website: Globe, sms: MessageSquare, email: Mail, whatsapp: MessageCircle, push: Smartphone }
