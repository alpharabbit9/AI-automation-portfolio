'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Star } from 'lucide-react'
import Link from 'next/link'
import type { Testimonial } from '@/lib/types'

type TestimonialInput = Omit<Testimonial, 'id' | 'created_at'>

interface Props {
  testimonial?: Testimonial
  isEdit?: boolean
  onSave: (data: TestimonialInput) => Promise<void>
}

const INPUT_CLASS =
  'w-full bg-[#0A0A0A] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#00E5FF]/40 transition-colors'
const LABEL_CLASS = 'block text-xs font-medium text-[#B3B3B3] uppercase tracking-wider mb-2'
const FIELD = 'space-y-1.5'

export default function TestimonialForm({ testimonial, isEdit, onSave }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<TestimonialInput>({
    author_name: testimonial?.author_name ?? '',
    author_role: testimonial?.author_role ?? '',
    author_company: testimonial?.author_company ?? '',
    author_avatar_url: testimonial?.author_avatar_url ?? null,
    quote: testimonial?.quote ?? '',
    rating: testimonial?.rating ?? 5,
    project_id: testimonial?.project_id ?? null,
    featured: testimonial?.featured ?? false,
    sort_order: testimonial?.sort_order ?? 0,
    is_active: testimonial?.is_active ?? true,
  })

  const set = (field: keyof TestimonialInput, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.author_name.trim() || !form.quote.trim()) {
      setError('Author name and quote are required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSave(form)
      router.push('/admin/testimonials')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/testimonials"
          className="p-2 rounded-xl border border-white/[0.08] text-[#B3B3B3] hover:text-white hover:bg-white/[0.04] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-white">
            {isEdit ? 'Edit Testimonial' : 'New Testimonial'}
          </h1>
          <p className="text-xs text-[#555] mt-0.5">
            {isEdit ? `Editing: ${testimonial?.author_name}` : 'Add a client testimonial'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Author Info */}
        <section className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Author</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className={FIELD}>
              <label className={LABEL_CLASS}>Name *</label>
              <input
                className={INPUT_CLASS}
                value={form.author_name}
                onChange={(e) => set('author_name', e.target.value)}
                placeholder="Jane Smith"
              />
            </div>
            <div className={FIELD}>
              <label className={LABEL_CLASS}>Role</label>
              <input
                className={INPUT_CLASS}
                value={form.author_role}
                onChange={(e) => set('author_role', e.target.value)}
                placeholder="CEO"
              />
            </div>
          </div>
          <div className={FIELD}>
            <label className={LABEL_CLASS}>Company</label>
            <input
              className={INPUT_CLASS}
              value={form.author_company}
              onChange={(e) => set('author_company', e.target.value)}
              placeholder="Acme Corp"
            />
          </div>
          <div className={FIELD}>
            <label className={LABEL_CLASS}>Avatar URL</label>
            <input
              className={INPUT_CLASS}
              value={form.author_avatar_url ?? ''}
              onChange={(e) => set('author_avatar_url', e.target.value || null)}
              placeholder="https://…"
            />
          </div>
        </section>

        {/* Quote */}
        <section className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            Testimonial
          </h2>
          <div className={FIELD}>
            <label className={LABEL_CLASS}>Quote *</label>
            <textarea
              rows={4}
              className={INPUT_CLASS}
              value={form.quote}
              onChange={(e) => set('quote', e.target.value)}
              placeholder="Working with Rifat transformed how we handle…"
            />
          </div>

          {/* Star Rating */}
          <div className={FIELD}>
            <label className={LABEL_CLASS}>Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set('rating', n)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      n <= form.rating ? 'text-amber-400 fill-amber-400' : 'text-[#444]'
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm text-[#B3B3B3] ml-2">{form.rating}/5</span>
            </div>
          </div>
        </section>

        {/* Settings */}
        <section className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => set('is_active', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-white/10 rounded-full peer-checked:bg-[#00E5FF]/70 transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
              </div>
              <span className="text-sm text-[#B3B3B3]">Active (visible)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set('featured', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-white/10 rounded-full peer-checked:bg-[#00E5FF]/70 transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
              </div>
              <span className="text-sm text-[#B3B3B3]">Featured</span>
            </label>
          </div>
          <div className={FIELD}>
            <label className={LABEL_CLASS}>Sort Order</label>
            <input
              type="number"
              className={INPUT_CLASS}
              value={form.sort_order}
              onChange={(e) => set('sort_order', parseInt(e.target.value, 10) || 0)}
            />
          </div>
        </section>

        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl font-semibold text-sm bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Testimonial'}
        </button>
      </form>
    </div>
  )
}
