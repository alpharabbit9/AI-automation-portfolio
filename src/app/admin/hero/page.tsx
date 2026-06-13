'use client'

import { useState } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { heroContent } from '@/lib/data'

export default function AdminHeroPage() {
  const [form, setForm] = useState(heroContent)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // TODO: save to Supabase
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Hero Section</h1>
          <p className="text-sm text-[#B3B3B3] mt-1">Edit the homepage hero content</p>
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

      <Section title="Headline & Description">
        <Field label="Headline (use \\n for line break)" name="headline" value={form.headline} onChange={handleChange} textarea />
        <Field label="Subheadline (badge text)" name="subheadline" value={form.subheadline} onChange={handleChange} />
        <Field label="Description" name="description" value={form.description} onChange={handleChange} textarea />
      </Section>

      <Section title="Call to Action">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Primary CTA Text" name="cta_primary_text" value={form.cta_primary_text} onChange={handleChange} />
          <Field label="Primary CTA URL" name="cta_primary_href" value={form.cta_primary_href} onChange={handleChange} />
          <Field label="Secondary CTA Text" name="cta_secondary_text" value={form.cta_secondary_text} onChange={handleChange} />
          <Field label="Secondary CTA URL" name="cta_secondary_href" value={form.cta_secondary_href} onChange={handleChange} />
        </div>
      </Section>

      <Section title="Stats">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Stat 1 Value" name="stat_1_value" value={form.stat_1_value} onChange={handleChange} />
          <Field label="Stat 1 Label" name="stat_1_label" value={form.stat_1_label} onChange={handleChange} />
          <Field label="Stat 2 Value" name="stat_2_value" value={form.stat_2_value} onChange={handleChange} />
          <Field label="Stat 2 Label" name="stat_2_label" value={form.stat_2_label} onChange={handleChange} />
          <Field label="Stat 3 Value" name="stat_3_value" value={form.stat_3_value} onChange={handleChange} />
          <Field label="Stat 3 Label" name="stat_3_label" value={form.stat_3_label} onChange={handleChange} />
          <Field label="Stat 4 Value" name="stat_4_value" value={form.stat_4_value} onChange={handleChange} />
          <Field label="Stat 4 Label" name="stat_4_label" value={form.stat_4_label} onChange={handleChange} />
        </div>
      </Section>
    </form>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#111111] p-6 space-y-4">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      {children}
    </div>
  )
}

function Field({
  label, name, value, onChange, textarea
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  textarea?: boolean
}) {
  const cls = "w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-[#B3B3B3]/50 focus:outline-none focus:border-[#00E5FF]/30 transition-all"
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[#B3B3B3]">{label}</label>
      {textarea ? (
        <textarea name={name} value={value} onChange={onChange} rows={3} className={`${cls} resize-none`} />
      ) : (
        <input type="text" name={name} value={value} onChange={onChange} className={cls} />
      )}
    </div>
  )
}
