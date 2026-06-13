import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s — Admin' },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch unread message count for sidebar badge
  let newMessageCount = 0
  try {
    const { count } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new')
    newMessageCount = count ?? 0
  } catch { /* table may not exist yet */ }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      <AdminSidebar userEmail={user.email ?? ''} newMessageCount={newMessageCount} />
      <main className="flex-1 min-w-0 lg:pl-64">
        <div className="p-6 lg:p-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  )
}
