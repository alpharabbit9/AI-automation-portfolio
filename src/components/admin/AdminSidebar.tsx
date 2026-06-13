'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, FileText, FolderOpen, Star, Settings,
  User, ExternalLink, LogOut, Menu, X, MessageSquare,
  Globe, BarChart3, Image, ChevronDown, ChevronRight,
  Zap,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  exact?: boolean
  badge?: number
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Hero Section', href: '/admin/hero', icon: Globe },
      { label: 'Services', href: '/admin/services', icon: Zap },
      { label: 'Projects', href: '/admin/projects', icon: FolderOpen },
      { label: 'Case Studies', href: '/admin/case-studies', icon: FileText },
      { label: 'Testimonials', href: '/admin/testimonials', icon: Star },
    ],
  },
  {
    label: 'Inbox',
    items: [
      { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
    ],
  },
  {
    label: 'Assets',
    items: [
      { label: 'Media Library', href: '/admin/media', icon: Image },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Profile', href: '/admin/profile', icon: User },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

interface Props {
  userEmail: string
  newMessageCount?: number
}

export default function AdminSidebar({ userEmail, newMessageCount = 0 }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  const toggleGroup = (label: string) => {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }))
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-white/[0.06] flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center flex-shrink-0">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#00E5FF]" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-white leading-none">Portfolio Admin</p>
          <p className="text-[10px] text-[#B3B3B3]/60 mt-0.5 leading-none">Rifat Ahmed</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {NAV_GROUPS.map(group => {
          const isCollapsed = collapsed[group.label]
          return (
            <div key={group.label} className="mb-1">
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex items-center justify-between w-full px-4 py-1.5 mb-0.5"
              >
                <span className="text-[10px] font-semibold tracking-widest uppercase text-[#B3B3B3]/50">
                  {group.label}
                </span>
                {isCollapsed
                  ? <ChevronRight className="w-3 h-3 text-[#B3B3B3]/40" />
                  : <ChevronDown className="w-3 h-3 text-[#B3B3B3]/40" />
                }
              </button>

              {!isCollapsed && (
                <div className="space-y-0.5 px-2">
                  {group.items.map(item => {
                    const Icon = item.icon
                    const active = isActive(item)
                    const badge = item.label === 'Messages' ? newMessageCount : (item.badge ?? 0)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group ${
                          active
                            ? 'bg-white/[0.08] text-white'
                            : 'text-[#B3B3B3] hover:bg-white/[0.04] hover:text-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${active ? 'text-[#00E5FF]' : 'group-hover:text-white/70'}`} />
                        <span className="flex-1 truncate">{item.label}</span>
                        {badge > 0 && (
                          <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-[#00E5FF] text-[#0A0A0A] rounded-full flex items-center justify-center">
                            {badge > 99 ? '99+' : badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 px-3 py-3 border-t border-white/[0.06] space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#B3B3B3] hover:bg-white/[0.04] hover:text-white transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          View Live Site
        </a>

        <div className="px-3 py-2 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#1A1A1A] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-semibold text-[#B3B3B3]">
              {userEmail.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-[#B3B3B3] truncate">{userEmail}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex-shrink-0 text-[#B3B3B3] hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#111111] border border-white/[0.08] text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        {newMessageCount > 0 && !mobileOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 text-[9px] font-bold bg-[#00E5FF] text-[#0A0A0A] rounded-full flex items-center justify-center">
            {newMessageCount}
          </span>
        )}
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`lg:hidden fixed left-0 top-0 bottom-0 z-40 w-64 bg-[#0F0F0F] border-r border-white/[0.06] transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-[#0F0F0F] border-r border-white/[0.06]">
        <SidebarContent />
      </aside>
    </>
  )
}
