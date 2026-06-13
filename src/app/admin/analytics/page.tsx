import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import {
  MessageSquare, CheckCheck, Archive, Clock,
  TrendingUp, Users, BarChart3
} from 'lucide-react'

export const metadata: Metadata = { title: 'Analytics' }

interface SubmissionRow {
  status: string
  service_interest: string | null
  budget: string | null
  created_at: string
}

async function getAnalyticsData() {
  try {
    const supabase = await createClient()
    const { data: submissions } = await supabase
      .from('contact_submissions')
      .select('status, service_interest, budget, created_at')
      .order('created_at', { ascending: false })

    const rows = (submissions ?? []) as SubmissionRow[]

    const total = rows.length
    const byStatus = {
      new: rows.filter((r) => r.status === 'new').length,
      read: rows.filter((r) => r.status === 'read').length,
      replied: rows.filter((r) => r.status === 'replied').length,
      archived: rows.filter((r) => r.status === 'archived').length,
    }

    // Service breakdown
    const serviceMap: Record<string, number> = {}
    rows.forEach((r) => {
      if (r.service_interest) {
        serviceMap[r.service_interest] = (serviceMap[r.service_interest] ?? 0) + 1
      }
    })
    const byService = Object.entries(serviceMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)

    // Budget breakdown
    const budgetMap: Record<string, number> = {}
    rows.forEach((r) => {
      if (r.budget) {
        budgetMap[r.budget] = (budgetMap[r.budget] ?? 0) + 1
      }
    })
    const byBudget = Object.entries(budgetMap).sort((a, b) => b[1] - a[1])

    // Monthly trend (last 6 months)
    const monthly: Record<string, number> = {}
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
      monthly[key] = 0
    }
    rows.forEach((r) => {
      const d = new Date(r.created_at)
      const key = d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
      if (key in monthly) monthly[key]++
    })

    const replyRate = total > 0 ? Math.round(((byStatus.replied) / total) * 100) : 0

    return { total, byStatus, byService, byBudget, monthly, replyRate }
  } catch {
    return {
      total: 0,
      byStatus: { new: 0, read: 0, replied: 0, archived: 0 },
      byService: [],
      byBudget: [],
      monthly: {},
      replyRate: 0,
    }
  }
}

export default async function AdminAnalyticsPage() {
  const { total, byStatus, byService, byBudget, monthly, replyRate } = await getAnalyticsData()

  const stats = [
    { label: 'Total Submissions', value: total, icon: MessageSquare, color: 'text-[#00E5FF]', bg: 'bg-[#00E5FF]/10' },
    { label: 'New / Unread', value: byStatus.new, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Replied', value: byStatus.replied, icon: CheckCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Reply Rate', value: `${replyRate}%`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ]

  const maxMonthly = Math.max(...Object.values(monthly), 1)
  const maxService = byService.length > 0 ? byService[0][1] : 1

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Analytics</h1>
        <p className="text-sm text-[#B3B3B3] mt-1">Contact form performance and submission trends</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
            </div>
            <div className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</div>
            <div className="text-xs text-[#555]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly trend chart */}
        <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-4 h-4 text-[#00E5FF]" />
            <h2 className="text-sm font-semibold text-white">Monthly Submissions</h2>
          </div>
          {Object.keys(monthly).length > 0 ? (
            <div className="flex items-end gap-3 h-32">
              {Object.entries(monthly).map(([month, count]) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-[#555]">{count}</span>
                  <div
                    className="w-full rounded-t-lg bg-[#00E5FF]/30 hover:bg-[#00E5FF]/50 transition-colors"
                    style={{ height: `${Math.max((count / maxMonthly) * 100, count > 0 ? 8 : 4)}%` }}
                  />
                  <span className="text-[10px] text-[#555] text-center leading-tight">{month}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center">
              <p className="text-sm text-[#555]">No data yet</p>
            </div>
          )}
        </div>

        {/* Status breakdown */}
        <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-4 h-4 text-[#00E5FF]" />
            <h2 className="text-sm font-semibold text-white">Status Breakdown</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'New', count: byStatus.new, color: 'bg-[#00E5FF]', textColor: 'text-[#00E5FF]' },
              { label: 'Read', count: byStatus.read, color: 'bg-[#B3B3B3]', textColor: 'text-[#B3B3B3]' },
              { label: 'Replied', count: byStatus.replied, color: 'bg-emerald-400', textColor: 'text-emerald-400' },
              { label: 'Archived', count: byStatus.archived, color: 'bg-[#444]', textColor: 'text-[#555]' },
            ].map((s) => (
              <div key={s.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#B3B3B3]">{s.label}</span>
                  <span className={`text-xs font-semibold ${s.textColor}`}>{s.count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.color} transition-all`}
                    style={{ width: total > 0 ? `${(s.count / total) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service interest */}
        {byService.length > 0 && (
          <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white mb-6">Popular Services</h2>
            <div className="space-y-3">
              {byService.map(([service, count]) => (
                <div key={service} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#B3B3B3] truncate mr-4">{service}</span>
                    <span className="text-xs font-semibold text-white flex-shrink-0">{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#00E5FF]/50 transition-all"
                      style={{ width: `${(count / maxService) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Budget breakdown */}
        {byBudget.length > 0 && (
          <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white mb-6">Budget Range</h2>
            <div className="space-y-3">
              {byBudget.map(([budget, count]) => (
                <div key={budget} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                  <span className="text-sm text-[#B3B3B3]">{budget}</span>
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-20 rounded-full bg-white/[0.04] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-purple-400/50"
                        style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-white w-4 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
