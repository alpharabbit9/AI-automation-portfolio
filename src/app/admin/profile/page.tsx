'use client'

import { useState } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { profile } from '@/lib/data'

export default function AdminProfilePage() {
  const [form, setForm] = useState(profile)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputCls = "w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-[#B3B3B3]/50 focus:outline-none focus:border-[#00E5FF]/30 transition-all"

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Profile</h1>
          <p className="text-sm text-[#B3B3B3] mt-1">Manage your personal information</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#0A0A0A] bg-white rounded-xl hover:bg-white/90 disabled:opacity-50 transition-all"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-[#111111] p-6 space-y-5">
        <h2 className="text-sm font-semibold text-white">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#B3B3B3]">Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#B3B3B3]">Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#B3B3B3]">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#B3B3B3]">Location</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#B3B3B3]">Availability Status</label>
            <input type="text" name="availability" value={form.availability} onChange={handleChange} className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#B3B3B3]">Years of Experience</label>
            <input type="number" name="years_experience" value={form.years_experience} onChange={handleChange} className={inputCls} />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#B3B3B3]">Bio</label>
          <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} className={`${inputCls} resize-none`} />
        </div>
      </div>
    </form>
  )
}
