'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Mail, MailOpen, MessageSquare, Trash2, Archive,
  CheckCheck, Clock, ChevronDown, Building2, DollarSign
} from 'lucide-react'
import DeleteDialog from '@/components/admin/DeleteDialog'
import { updateMessageStatus, deleteMessage, deleteMessages, type MessageStatus } from './actions'

interface Message {
  id: string
  name: string
  email: string
  company: string | null
  service_interest: string | null
  budget: string | null
  message: string
  status: MessageStatus
  created_at: string
}

const STATUS_LABELS: Record<MessageStatus, string> = {
  new: 'New',
  read: 'Read',
  replied: 'Replied',
  archived: 'Archived',
}

const STATUS_STYLES: Record<MessageStatus, string> = {
  new: 'text-[#00E5FF] bg-[#00E5FF]/10 border-[#00E5FF]/20',
  read: 'text-[#B3B3B3] bg-white/[0.04] border-white/[0.08]',
  replied: 'text-emerald-400 bg-emerald-400/8 border-emerald-400/20',
  archived: 'text-[#555] bg-white/[0.02] border-white/[0.04]',
}

interface Props {
  messages: Message[]
  initialFilter?: MessageStatus | 'all'
}

export default function MessagesInbox({ messages, initialFilter = 'all' }: Props) {
  const router = useRouter()
  const [filter, setFilter] = useState<MessageStatus | 'all'>(initialFilter)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)

  const filtered = filter === 'all' ? messages : messages.filter((m) => m.status === filter)
  const counts = {
    all: messages.length,
    new: messages.filter((m) => m.status === 'new').length,
    read: messages.filter((m) => m.status === 'read').length,
    replied: messages.filter((m) => m.status === 'replied').length,
    archived: messages.filter((m) => m.status === 'archived').length,
  }

  const handleStatus = async (id: string, status: MessageStatus) => {
    await updateMessageStatus(id, status)
    router.refresh()
  }

  const handleExpand = async (id: string, currentStatus: MessageStatus) => {
    setExpanded((prev) => (prev === id ? null : id))
    if (currentStatus === 'new') {
      await updateMessageStatus(id, 'read')
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteMessage(deleteId)
    router.refresh()
  }

  const handleBulkDelete = async () => {
    setBulkDeleting(true)
    try {
      await deleteMessages(Array.from(selected))
      setSelected(new Set())
      router.refresh()
    } finally {
      setBulkDeleting(false)
    }
  }

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#111111] border border-white/[0.06] rounded-xl w-fit">
        {(['all', 'new', 'read', 'replied', 'archived'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filter === f
                ? 'bg-white/[0.08] text-white'
                : 'text-[#B3B3B3] hover:text-white'
            }`}
          >
            {f === 'all' ? 'All' : STATUS_LABELS[f]}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
              filter === f ? 'bg-white/[0.1] text-white' : 'bg-white/[0.05] text-[#555]'
            }`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#00E5FF]/5 border border-[#00E5FF]/20">
          <span className="text-xs text-[#00E5FF]">{selected.size} selected</span>
          <button
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {bulkDeleting ? 'Deleting…' : `Delete ${selected.size}`}
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs text-[#555] hover:text-[#B3B3B3] transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Messages */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-white/[0.08] bg-[#111111] p-16 text-center">
          <MessageSquare className="w-10 h-10 text-[#555] mx-auto mb-4" />
          <h3 className="text-base font-medium text-white mb-1">No messages</h3>
          <p className="text-sm text-[#B3B3B3]">
            {filter === 'all' ? 'Contact form submissions will appear here.' : `No ${filter} messages.`}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border transition-all ${
                msg.status === 'new'
                  ? 'border-[#00E5FF]/20 bg-[#00E5FF]/[0.02]'
                  : 'border-white/[0.06] bg-[#111111]'
              }`}
            >
              {/* Row */}
              <div className="flex items-center gap-3 p-4">
                <input
                  type="checkbox"
                  checked={selected.has(msg.id)}
                  onChange={() => toggleSelect(msg.id)}
                  className="w-4 h-4 rounded border-white/20 bg-transparent accent-[#00E5FF] flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-sm font-medium ${msg.status === 'new' ? 'text-white' : 'text-[#B3B3B3]'}`}>
                      {msg.name}
                    </span>
                    {msg.company && (
                      <span className="flex items-center gap-1 text-xs text-[#555]">
                        <Building2 className="w-3 h-3" /> {msg.company}
                      </span>
                    )}
                    <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold rounded border ${STATUS_STYLES[msg.status]}`}>
                      {STATUS_LABELS[msg.status]}
                    </span>
                    {msg.status === 'new' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="text-xs text-[#555]">{msg.email}</span>
                    {msg.service_interest && (
                      <span className="text-xs text-[#555]">· {msg.service_interest}</span>
                    )}
                    {msg.budget && (
                      <span className="flex items-center gap-1 text-xs text-[#555]">
                        <DollarSign className="w-2.5 h-2.5" />{msg.budget}
                      </span>
                    )}
                    <span className="text-xs text-[#555] ml-auto flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {msg.status !== 'replied' && (
                    <button
                      onClick={() => handleStatus(msg.id, 'replied')}
                      title="Mark replied"
                      className="p-1.5 text-[#555] hover:text-emerald-400 rounded-lg hover:bg-emerald-400/10 transition-all"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {msg.status !== 'archived' && (
                    <button
                      onClick={() => handleStatus(msg.id, 'archived')}
                      title="Archive"
                      className="p-1.5 text-[#555] hover:text-amber-400 rounded-lg hover:bg-amber-400/10 transition-all"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteId(msg.id)}
                    className="p-1.5 text-[#555] hover:text-red-400 rounded-lg hover:bg-red-400/10 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleExpand(msg.id, msg.status)}
                    className="p-1.5 text-[#555] hover:text-white rounded-lg hover:bg-white/[0.05] transition-all"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expanded === msg.id ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>
              </div>

              {/* Expanded message body */}
              {expanded === msg.id && (
                <div className="px-4 pb-4 pt-0 border-t border-white/[0.06]">
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#555]">
                      <MailOpen className="w-3.5 h-3.5" />
                      <span>From: <span className="text-[#B3B3B3]">{msg.name} &lt;{msg.email}&gt;</span></span>
                    </div>
                    <p className="text-sm text-[#B3B3B3] leading-relaxed whitespace-pre-wrap bg-white/[0.02] rounded-xl p-4 border border-white/[0.06]">
                      {msg.message}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.service_interest ?? 'Your Inquiry')}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#0A0A0A] bg-white rounded-lg hover:bg-white/90 transition-all"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Reply via Email
                      </a>
                      {msg.status !== 'replied' && (
                        <button
                          onClick={() => handleStatus(msg.id, 'replied')}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg hover:bg-emerald-400/20 transition-all"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          Mark as Replied
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete message?"
        description="This will permanently remove the message from your inbox."
        onConfirm={handleDelete}
      />
    </div>
  )
}
