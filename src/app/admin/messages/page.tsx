import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import MessagesInbox from './MessagesInbox'

export const metadata: Metadata = { title: 'Messages' }

async function getMessages() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  } catch {
    return []
  }
}

export default async function AdminMessagesPage() {
  const messages = await getMessages()
  const newCount = messages.filter((m: { status: string }) => m.status === 'new').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Messages</h1>
          <p className="text-sm text-[#B3B3B3] mt-1">
            {messages.length} total
            {newCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 rounded">
                {newCount} new
              </span>
            )}
          </p>
        </div>
      </div>

      <MessagesInbox messages={messages} />
    </div>
  )
}
