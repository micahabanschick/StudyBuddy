import {
  LayoutDashboard,
  GraduationCap,
  MessageSquare,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  description: string
}

export const PRIMARY_NAV: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Overview, due reviews, recent activity',
  },
  {
    href: '/review',
    label: 'Review',
    icon: Sparkles,
    description: "Today's spaced-repetition queue",
  },
  {
    href: '/courses',
    label: 'Courses',
    icon: GraduationCap,
    description: 'All your courses and materials',
  },
  {
    href: '/chat',
    label: 'Chat',
    icon: MessageSquare,
    description: 'Ask questions grounded in your materials',
  },
]
