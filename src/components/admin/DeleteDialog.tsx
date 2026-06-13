'use client'

import { useState } from 'react'
import { Loader2, Trash2 } from 'lucide-react'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  onConfirm: () => Promise<void>
}

export default function DeleteDialog({
  open,
  onOpenChange,
  title = 'Delete this item?',
  description = 'This action cannot be undone.',
  onConfirm,
}: Props) {
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => !loading && onOpenChange(false)}
      />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#111111] p-6 shadow-2xl">
        <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <Trash2 className="w-5 h-5 text-red-400" />
        </div>
        <h2 className="text-base font-semibold text-white mb-1">{title}</h2>
        <p className="text-sm text-[#B3B3B3] mb-6">{description}</p>
        <div className="flex gap-3">
          <button
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-[#B3B3B3] border border-white/[0.08] rounded-xl hover:bg-white/[0.04] hover:text-white disabled:opacity-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500/80 rounded-xl hover:bg-red-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
