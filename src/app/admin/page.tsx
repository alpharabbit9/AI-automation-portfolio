import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, FileText, FolderOpen, Star, MessageSquare, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { caseStudies as staticStudies, services, testimonials as staticTestimonials } from '@/lib/data'

export const metadata: Metadata = { title: 'Dashboard' }

interface RecentMessage {
  id: string
  name: string
  email: string
  message: string
  service_interest: string | null
  status: string
  created_at: string
}

async function getDashboardData() {
  try {
    const supabase = await createClient()
    const [csRes, projRes, testRes, msgRes, recentMsgRes] = await Promise.all([
      supabase.from('case_studies').select('*', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(5),
    ])
    return {
      caseStudyCount: csRes.count ?? staticStudies.length,
      projectCount: projRes.count ?? 0,
      testimonialCount: testRes.count ?? staticTestimonials.length,
      newMessageCount: msgRes.count ?? 0,
      recentMessages: (recentMsgRes.data ?? []) as RecentMessage[],
    }
  } catch {
    return {
      caseStudyCount: staticStudies.filter(s => s.is_published).length,
      projectCount: 0,
      testimonialCount: staticTestimonials.filter(t => t.is_active).length,
      newMessageCount: 0,
      recentMessages: [] as RecentMessage[],
    }
  }
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData()

  const stats = [
    { label: 'Case Studies', value: data.caseStudyCount, icon: FileText, href: '/admin/case-studies', color: 'text-[#00E5FF]', bg: 'bg-[#00E5FF]/10', change: 'Published' },
    { label: 'Projects', value: data.projectCount, icon: FolderOpen, href: '/admin/projects', color: 'text-purple-400', bg: 'bg-purple-400/10', change: 'Active' },
    { label: 'Testimonials', value: data.testimonialCount, icon: Star, href: '/admin/testimonials', color: 'text-amber-400', bg: 'bg-amber-400/10', change: 'Active' },
    { label: 'New Messages', value: data.newMessageCount, icon: MessageSquare, href: '/admin/messages', color: 'text-emerald-400', bg: 'bg-emerald-400/10', change: 'Unread' },
  ]

  const quickActions = [
    { label: 'New Case Study', href: '/admin/case-studies/new', desc: 'Publish a client success story', icon: FileText },
    { label: 'Add Project', href: '/admin/projects/new', desc: 'Add to your portfolio', icon: FolderOpen },
    { label: 'Add Testimonial', href: '/admin/testimonials/new', desc: 'Add client feedback', icon: Star },
    { label: 'Edit Hero', href: '/admin/hero', desc: 'Update homepage headline & stats', icon: TrendingUp },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#B3B3B3] mt-1">Welcome back. Here&apos;s what&apos;s happening on your portfolio.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <div className="rounded-xl border border-white/[0.08] bg-[#111111] p-5 hover:border-white/[0.14] hover:bg-[#161616] transition-all group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-4.5 h-4.5 ${stat.color}`} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#B3B3B3] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-3xl font-semibold text-white tracking-tight mb-1">{stat.value}</div>
                <div className="text-xs text-[#B3B3B3]">{stat.label}</div>
                <div className="text-[10px] text-[#B3B3B3]/50 mt-0.5">{stat.change}</div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <h2 className="text-xs font-semibold text-[#B3B3B3] uppercase tracking-widest mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {quickActions.map(action => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href}>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.08] bg-[#111111] hover:border-white/[0.14] hover:bg-[#161616] transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#B3B3B3] group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{action.label}</div>
                      <div className="text-xs text-[#B3B3B3] truncate">{action.desc}</div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#B3B3B3] opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-[#B3B3B3] uppercase tracking-widest">Recent Messages</h2>
            <Link href="/admin/messages" className="text-xs text-[#B3B3B3] hover:text-white transition-colors flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          {data.recentMessages.length === 0 ? (
            <div className="rounded-xl border border-white/[0.08] bg-[#111111] p-10 text-center">
              <MessageSquare className="w-8 h-8 text-[#B3B3B3]/30 mx-auto mb-3" />
              <p className="text-sm text-[#B3B3B3]">No messages yet</p>
              <p className="text-xs text-[#B3B3B3]/50 mt-1">Contact form submissions will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.recentMessages.map((msg) => (
                <div key={String(msg.id)} className="flex items-start gap-3 p-4 rounded-xl border border-white/[0.08] bg-[#111111] hover:border-white/[0.12] transition-all">
                  <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-[#B3B3B3]">
                      {String(msg.name ?? 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-white truncate">{String(msg.name ?? '')}</span>
                      {msg.status === 'new' && (
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                      )}
                    </div>
                    <p className="text-xs text-[#B3B3B3] truncate">{String(msg.message ?? '')}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-[#B3B3B3]/50">{String(msg.email ?? '')}</span>
                      {msg.service_interest && (
                        <span className="text-[10px] text-[#00E5FF]/60">{String(msg.service_interest)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {msg.status === 'new' ? (
                      <span className="text-[10px] font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">New</span>
                    ) : (
                      <CheckCircle className="w-4 h-4 text-[#B3B3B3]/40" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Site info row */}
      <div className="rounded-xl border border-white/[0.06] bg-[#0F0F0F] p-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-[#B3B3B3]">Portfolio is <span className="text-white font-medium">live</span> and indexed</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-[#B3B3B3]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {services.length} services active
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
            View site <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
