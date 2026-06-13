'use client'

import { useState } from 'react'
import { Save, Loader2 } from 'lucide-react'

const settingsFields = [
  { key: 'site_title', label: 'Site Title', placeholder: 'Rifat Ahmed — AI Automation Consultant', type: 'text' },
  { key: 'site_description', label: 'Meta Description', placeholder: 'Your site description...', type: 'textarea' },
  { key: 'calendly_url', label: 'Calendly URL', placeholder: 'https://calendly.com/yourname', type: 'text' },
  { key: 'contact_email', label: 'Contact Email', placeholder: 'hello@yourdomain.com', type: 'email' },
  { key: 'twitter_url', label: 'Twitter / X URL', placeholder: 'https://x.com/yourhandle', type: 'text' },
  { key: 'linkedin_url', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/yourprofile', type: 'text' },
  { key: 'github_url', label: 'GitHub URL', placeholder: 'https://github.com/yourhandle', type: 'text' },
]

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }))
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
          <h1 className="text-2xl font-semibold text-white">Settings</h1>
          <p className="text-sm text-[#B3B3B3] mt-1">Global website configuration</p>
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
        <h2 className="text-sm font-semibold text-white">Site Configuration</h2>
        {settingsFields.map(field => (
          <div key={field.key} className="space-y-1.5">
            <label className="text-xs font-medium text-[#B3B3B3]">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                rows={3}
                placeholder={field.placeholder}
                value={values[field.key] ?? ''}
                onChange={e => handleChange(field.key, e.target.value)}
                className={`${inputCls} resize-none`}
              />
            ) : (
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={values[field.key] ?? ''}
                onChange={e => handleChange(field.key, e.target.value)}
                className={inputCls}
              />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-[#111111] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white">Danger Zone</h2>
        <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/20 bg-red-500/[0.04]">
          <div>
            <div className="text-sm font-medium text-white">Put Site in Maintenance Mode</div>
            <div className="text-xs text-[#B3B3B3] mt-0.5">Temporarily hide the site from public visitors</div>
          </div>
          <button type="button" className="px-3 py-1.5 text-xs font-medium text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-all">
            Enable
          </button>
        </div>
      </div>
    </form>
  )
}
