'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { CaseStudy, CaseStudyMetric } from '@/lib/types'

type CaseStudyInput = Omit<CaseStudy, 'id' | 'created_at' | 'updated_at'>

interface Props {
  caseStudy?: CaseStudy
  isEdit?: boolean
  onSave: (data: CaseStudyInput) => Promise<void>
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const INPUT_CLASS =
  'w-full bg-[#0A0A0A] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#00E5FF]/40 transition-colors'
const LABEL_CLASS = 'block text-xs font-medium text-[#B3B3B3] uppercase tracking-wider mb-2'
const FIELD = 'space-y-1.5'

export default function CaseStudyForm({ caseStudy, isEdit, onSave }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<CaseStudyInput>({
    project_id: caseStudy?.project_id ?? null,
    title: caseStudy?.title ?? '',
    slug: caseStudy?.slug ?? '',
    client_name: caseStudy?.client_name ?? '',
    client_industry: caseStudy?.client_industry ?? '',
    client_size: caseStudy?.client_size ?? null,
    challenge: caseStudy?.challenge ?? '',
    solution: caseStudy?.solution ?? '',
    implementation: caseStudy?.implementation ?? null,
    results: caseStudy?.results ?? '',
    testimonial_quote: caseStudy?.testimonial_quote ?? null,
    testimonial_author: caseStudy?.testimonial_author ?? null,
    testimonial_role: caseStudy?.testimonial_role ?? null,
    cover_image_url: caseStudy?.cover_image_url ?? null,
    pdf_url: caseStudy?.pdf_url ?? null,
    live_url: caseStudy?.live_url ?? null,
    tags: caseStudy?.tags ?? [],
    tech_stack: caseStudy?.tech_stack ?? [],
    duration: caseStudy?.duration ?? null,
    metrics: caseStudy?.metrics ?? [],
    featured: caseStudy?.featured ?? false,
    sort_order: caseStudy?.sort_order ?? 0,
    is_published: caseStudy?.is_published ?? false,
  })

  const set = (field: keyof CaseStudyInput, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleTitleChange = (val: string) => {
    set('title', val)
    if (!isEdit) set('slug', slugify(val))
  }

  // Tags
  const [tagInput, setTagInput] = useState('')
  const addTag = () => {
    const t = tagInput.trim()
    if (t && !form.tags.includes(t)) set('tags', [...form.tags, t])
    setTagInput('')
  }
  const removeTag = (t: string) => set('tags', form.tags.filter((x) => x !== t))

  // Tech stack
  const [techInput, setTechInput] = useState('')
  const addTech = () => {
    const t = techInput.trim()
    if (t && !form.tech_stack.includes(t)) set('tech_stack', [...form.tech_stack, t])
    setTechInput('')
  }
  const removeTech = (t: string) => set('tech_stack', form.tech_stack.filter((x) => x !== t))

  // Metrics
  const addMetric = () =>
    set('metrics', [...form.metrics, { value: '', label: '', description: '' }])
  const updateMetric = (i: number, field: keyof CaseStudyMetric, val: string) => {
    const updated = form.metrics.map((m, idx) => (idx === i ? { ...m, [field]: val } : m))
    set('metrics', updated)
  }
  const removeMetric = (i: number) => set('metrics', form.metrics.filter((_, idx) => idx !== i))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.slug.trim()) {
      setError('Title and slug are required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSave(form)
      router.push('/admin/case-studies')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/case-studies"
          className="p-2 rounded-xl border border-white/[0.08] text-[#B3B3B3] hover:text-white hover:bg-white/[0.04] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-white">
            {isEdit ? 'Edit Case Study' : 'New Case Study'}
          </h1>
          <p className="text-xs text-[#555] mt-0.5">
            {isEdit ? `Editing: ${caseStudy?.title}` : 'Add a new client success story'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <section className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6 space-y-5">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                Basic Information
              </h2>
              <div className={FIELD}>
                <label className={LABEL_CLASS}>Title *</label>
                <input
                  className={INPUT_CLASS}
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="AI Lead Scoring System for SaaS"
                />
              </div>
              <div className={FIELD}>
                <label className={LABEL_CLASS}>Slug *</label>
                <input
                  className={INPUT_CLASS}
                  value={form.slug}
                  onChange={(e) => set('slug', e.target.value)}
                  placeholder="ai-lead-scoring-saas"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className={FIELD}>
                  <label className={LABEL_CLASS}>Client Name</label>
                  <input
                    className={INPUT_CLASS}
                    value={form.client_name}
                    onChange={(e) => set('client_name', e.target.value)}
                    placeholder="Acme Corp"
                  />
                </div>
                <div className={FIELD}>
                  <label className={LABEL_CLASS}>Industry</label>
                  <input
                    className={INPUT_CLASS}
                    value={form.client_industry}
                    onChange={(e) => set('client_industry', e.target.value)}
                    placeholder="SaaS / E-Commerce"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className={FIELD}>
                  <label className={LABEL_CLASS}>Client Size</label>
                  <input
                    className={INPUT_CLASS}
                    value={form.client_size ?? ''}
                    onChange={(e) => set('client_size', e.target.value || null)}
                    placeholder="10-50 employees"
                  />
                </div>
                <div className={FIELD}>
                  <label className={LABEL_CLASS}>Duration</label>
                  <input
                    className={INPUT_CLASS}
                    value={form.duration ?? ''}
                    onChange={(e) => set('duration', e.target.value || null)}
                    placeholder="6 weeks"
                  />
                </div>
              </div>
            </section>

            {/* Challenge */}
            <section className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6 space-y-5">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                The Problem
              </h2>
              <div className={FIELD}>
                <label className={LABEL_CLASS}>Challenge *</label>
                <textarea
                  rows={4}
                  className={INPUT_CLASS}
                  value={form.challenge}
                  onChange={(e) => set('challenge', e.target.value)}
                  placeholder="Describe the core problem the client was facing…"
                />
              </div>
            </section>

            {/* Solution */}
            <section className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6 space-y-5">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                The Solution
              </h2>
              <div className={FIELD}>
                <label className={LABEL_CLASS}>Solution *</label>
                <textarea
                  rows={4}
                  className={INPUT_CLASS}
                  value={form.solution}
                  onChange={(e) => set('solution', e.target.value)}
                  placeholder="Explain the approach and what was built…"
                />
              </div>
              <div className={FIELD}>
                <label className={LABEL_CLASS}>Implementation Details</label>
                <textarea
                  rows={4}
                  className={INPUT_CLASS}
                  value={form.implementation ?? ''}
                  onChange={(e) => set('implementation', e.target.value || null)}
                  placeholder="Technical deep-dive, architecture, key integrations…"
                />
              </div>
            </section>

            {/* Results */}
            <section className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6 space-y-5">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                Results
              </h2>
              <div className={FIELD}>
                <label className={LABEL_CLASS}>Results Summary *</label>
                <textarea
                  rows={3}
                  className={INPUT_CLASS}
                  value={form.results}
                  onChange={(e) => set('results', e.target.value)}
                  placeholder="High-level outcomes and impact achieved…"
                />
              </div>

              {/* Metrics */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={LABEL_CLASS + ' mb-0'}>Key Metrics</label>
                  <button
                    type="button"
                    onClick={addMetric}
                    className="flex items-center gap-1.5 text-xs text-[#00E5FF] hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Metric
                  </button>
                </div>
                <div className="space-y-3">
                  {form.metrics.map((m, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <input
                          className={INPUT_CLASS}
                          value={m.value}
                          onChange={(e) => updateMetric(i, 'value', e.target.value)}
                          placeholder="3x"
                        />
                        <input
                          className={INPUT_CLASS}
                          value={m.label}
                          onChange={(e) => updateMetric(i, 'label', e.target.value)}
                          placeholder="Revenue Growth"
                        />
                        <input
                          className={INPUT_CLASS}
                          value={m.description ?? ''}
                          onChange={(e) => updateMetric(i, 'description', e.target.value)}
                          placeholder="Optional detail"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMetric(i)}
                        className="mt-2.5 p-1.5 text-[#555] hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {form.metrics.length === 0 && (
                    <p className="text-xs text-[#555] py-2">No metrics yet. Click "Add Metric" to add quantifiable results.</p>
                  )}
                </div>
              </div>
            </section>

            {/* Testimonial */}
            <section className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6 space-y-5">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                Client Testimonial
              </h2>
              <div className={FIELD}>
                <label className={LABEL_CLASS}>Quote</label>
                <textarea
                  rows={3}
                  className={INPUT_CLASS}
                  value={form.testimonial_quote ?? ''}
                  onChange={(e) => set('testimonial_quote', e.target.value || null)}
                  placeholder="What the client said about working with you…"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className={FIELD}>
                  <label className={LABEL_CLASS}>Author Name</label>
                  <input
                    className={INPUT_CLASS}
                    value={form.testimonial_author ?? ''}
                    onChange={(e) => set('testimonial_author', e.target.value || null)}
                    placeholder="Jane Smith"
                  />
                </div>
                <div className={FIELD}>
                  <label className={LABEL_CLASS}>Author Role</label>
                  <input
                    className={INPUT_CLASS}
                    value={form.testimonial_role ?? ''}
                    onChange={(e) => set('testimonial_role', e.target.value || null)}
                    placeholder="CEO at Acme Corp"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <section className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                Status
              </h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => set('is_published', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-white/10 rounded-full peer-checked:bg-[#00E5FF]/70 transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
                </div>
                <span className="text-sm text-[#B3B3B3]">Published</span>
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

            {/* Cover Image */}
            <section className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                Cover Image
              </h2>
              <div className={FIELD}>
                <label className={LABEL_CLASS}>Image URL (Cloudinary)</label>
                <input
                  className={INPUT_CLASS}
                  value={form.cover_image_url ?? ''}
                  onChange={(e) => set('cover_image_url', e.target.value || null)}
                  placeholder="https://res.cloudinary.com/…"
                />
              </div>
              {form.cover_image_url && (
                <div className="rounded-xl overflow-hidden border border-white/[0.08] aspect-video">
                  <img
                    src={form.cover_image_url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              )}
            </section>

            {/* Project Links */}
            <section className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                Project Links
              </h2>
              <div className={FIELD}>
                <label className={LABEL_CLASS}>Live Demo URL</label>
                <input
                  className={INPUT_CLASS}
                  value={form.live_url ?? ''}
                  onChange={(e) => set('live_url', e.target.value || null)}
                  placeholder="https://your-demo.vercel.app"
                />
              </div>
              <div className={FIELD}>
                <label className={LABEL_CLASS}>PDF URL (Cloudinary)</label>
                <input
                  className={INPUT_CLASS}
                  value={form.pdf_url ?? ''}
                  onChange={(e) => set('pdf_url', e.target.value || null)}
                  placeholder="https://res.cloudinary.com/…/raw/upload/…"
                />
              </div>
            </section>

            {/* Tags */}
            <section className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Tags</h2>
              <div className="flex gap-2">
                <input
                  className={INPUT_CLASS + ' flex-1'}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tag…"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-2.5 text-sm bg-white/[0.06] rounded-xl border border-white/[0.08] text-[#B3B3B3] hover:text-white hover:bg-white/[0.1] transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#B3B3B3] bg-white/[0.05] border border-white/[0.08] rounded-lg"
                  >
                    {t}
                    <button type="button" onClick={() => removeTag(t)} className="text-[#555] hover:text-red-400">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </section>

            {/* Tech Stack */}
            <section className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                Tech Stack
              </h2>
              <div className="flex gap-2">
                <input
                  className={INPUT_CLASS + ' flex-1'}
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                  placeholder="Next.js, n8n…"
                />
                <button
                  type="button"
                  onClick={addTech}
                  className="px-3 py-2.5 text-sm bg-white/[0.06] rounded-xl border border-white/[0.08] text-[#B3B3B3] hover:text-white hover:bg-white/[0.1] transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.tech_stack.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#00E5FF] bg-[#00E5FF]/8 border border-[#00E5FF]/20 rounded-lg"
                  >
                    {t}
                    <button type="button" onClick={() => removeTech(t)} className="text-[#00E5FF]/50 hover:text-red-400">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </section>

            {/* Submit */}
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
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Case Study'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
