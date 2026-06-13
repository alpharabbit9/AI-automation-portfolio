'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Project } from '@/lib/types'

const CATEGORIES = ['AI Agents', 'Automation', 'Dashboard', 'CRM Integration', 'Internal Tools', 'Lead Generation', 'Other']
const STATUSES: Project['status'][] = ['completed', 'in_progress', 'featured']

interface Props {
  project?: Project
  onSave: (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  isEdit?: boolean
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const inputCls = 'w-full px-4 py-3 bg-[#161616] border border-white/[0.08] rounded-xl text-sm text-white placeholder-[#B3B3B3]/40 focus:outline-none focus:border-[#00E5FF]/30 transition-all'
const labelCls = 'block text-xs font-medium text-[#B3B3B3] mb-1.5 tracking-wide'

export default function ProjectForm({ project, onSave, isEdit = false }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: project?.title ?? '',
    slug: project?.slug ?? '',
    description: project?.description ?? '',
    long_description: project?.long_description ?? '',
    category: project?.category ?? CATEGORIES[0],
    tags: (project?.tags ?? []).join(', '),
    tech_stack: (project?.tech_stack ?? []).join(', '),
    status: project?.status ?? ('completed' as Project['status']),
    featured: project?.featured ?? false,
    is_active: project?.is_active ?? true,
    client_name: project?.client_name ?? '',
    client_industry: project?.client_industry ?? '',
    duration: project?.duration ?? '',
    image_url: project?.image_url ?? '',
    result_metric_1_value: project?.result_metric_1_value ?? '',
    result_metric_1_label: project?.result_metric_1_label ?? '',
    result_metric_2_value: project?.result_metric_2_value ?? '',
    result_metric_2_label: project?.result_metric_2_label ?? '',
    result_metric_3_value: project?.result_metric_3_value ?? '',
    result_metric_3_label: project?.result_metric_3_label ?? '',
    sort_order: project?.sort_order ?? 0,
    images: project?.images ?? [],
  })

  const update = (key: string, value: unknown) => setForm(prev => ({ ...prev, [key]: value }))

  const handleTitleChange = (v: string) => {
    update('title', v)
    if (!isEdit) update('slug', slugify(v))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      try {
        await onSave({
          title: form.title,
          slug: form.slug,
          description: form.description,
          long_description: form.long_description || null,
          category: form.category,
          tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
          tech_stack: form.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
          status: form.status,
          featured: form.featured,
          is_active: form.is_active,
          client_name: form.client_name || null,
          client_industry: form.client_industry || null,
          duration: form.duration || null,
          image_url: form.image_url || null,
          images: form.images,
          result_metric_1_value: form.result_metric_1_value || null,
          result_metric_1_label: form.result_metric_1_label || null,
          result_metric_2_value: form.result_metric_2_value || null,
          result_metric_2_label: form.result_metric_2_label || null,
          result_metric_3_value: form.result_metric_3_value || null,
          result_metric_3_label: form.result_metric_3_label || null,
          sort_order: form.sort_order,
        })
        router.push('/admin/projects')
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save project')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/projects" className="p-2 text-[#B3B3B3] hover:text-white border border-white/[0.08] rounded-xl transition-all hover:bg-white/[0.04]">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              {isEdit ? 'Edit Project' : 'New Project'}
            </h1>
            <p className="text-sm text-[#B3B3B3] mt-0.5">
              {isEdit ? 'Update project details' : 'Add a project to your portfolio'}
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#0A0A0A] bg-white rounded-xl hover:bg-white/90 disabled:opacity-50 transition-all"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isPending ? 'Saving…' : 'Save Project'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main fields */}
        <div className="lg:col-span-2 space-y-5">
          <Card title="Basic Information">
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Project Title <span className="text-[#00E5FF]/60">*</span></label>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="E.g. AI Sales Agent for SaaS Company"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>URL Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => update('slug', slugify(e.target.value))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Short Description <span className="text-[#00E5FF]/60">*</span></label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  placeholder="One-paragraph summary of the project and its impact…"
                  className={`${inputCls} resize-none`}
                />
              </div>
              <div>
                <label className={labelCls}>Full Description</label>
                <textarea
                  rows={5}
                  value={form.long_description}
                  onChange={e => update('long_description', e.target.value)}
                  placeholder="Detailed breakdown of the project, approach, and outcomes…"
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>
          </Card>

          <Card title="Client Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Client Name</label>
                <input type="text" value={form.client_name} onChange={e => update('client_name', e.target.value)} placeholder="Acme Inc." className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Client Industry</label>
                <input type="text" value={form.client_industry} onChange={e => update('client_industry', e.target.value)} placeholder="B2B SaaS" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Duration</label>
                <input type="text" value={form.duration} onChange={e => update('duration', e.target.value)} placeholder="6 weeks" className={inputCls} />
              </div>
            </div>
          </Card>

          <Card title="Tech & Tags">
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Tech Stack <span className="text-[#B3B3B3]/50 font-normal">(comma-separated)</span></label>
                <input type="text" value={form.tech_stack} onChange={e => update('tech_stack', e.target.value)} placeholder="Claude API, n8n, HubSpot, PostgreSQL" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Tags <span className="text-[#B3B3B3]/50 font-normal">(comma-separated)</span></label>
                <input type="text" value={form.tags} onChange={e => update('tags', e.target.value)} placeholder="AI Agents, Sales Automation, HubSpot" className={inputCls} />
              </div>
            </div>
          </Card>

          <Card title="Key Results">
            {[1, 2, 3].map(n => (
              <div key={n} className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Metric {n} Value</label>
                  <input
                    type="text"
                    value={form[`result_metric_${n}_value` as keyof typeof form] as string}
                    onChange={e => update(`result_metric_${n}_value`, e.target.value)}
                    placeholder="312%"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Metric {n} Label</label>
                  <input
                    type="text"
                    value={form[`result_metric_${n}_label` as keyof typeof form] as string}
                    onChange={e => update(`result_metric_${n}_label`, e.target.value)}
                    placeholder="Pipeline Growth"
                    className={inputCls}
                  />
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Sidebar fields */}
        <div className="space-y-5">
          <Card title="Status & Visibility">
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Status</label>
                <select
                  value={form.status}
                  onChange={e => update('status', e.target.value as Project['status'])}
                  className={`${inputCls} cursor-pointer`}
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s} className="bg-[#161616]">{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select
                  value={form.category}
                  onChange={e => update('category', e.target.value)}
                  className={`${inputCls} cursor-pointer`}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c} className="bg-[#161616]">{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Sort Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={e => update('sort_order', parseInt(e.target.value) || 0)}
                  className={inputCls}
                />
              </div>
              <div className="space-y-3 pt-1">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={e => update('featured', e.target.checked)}
                    className="w-4 h-4 rounded accent-[#00E5FF]"
                  />
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-white">Featured</div>
                    <div className="text-xs text-[#B3B3B3]">Show prominently on portfolio</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={e => update('is_active', e.target.checked)}
                    className="w-4 h-4 rounded accent-[#00E5FF]"
                  />
                  <div>
                    <div className="text-sm font-medium text-white">Active</div>
                    <div className="text-xs text-[#B3B3B3]">Visible on the site</div>
                  </div>
                </label>
              </div>
            </div>
          </Card>

          <Card title="Cover Image">
            <div>
              <label className={labelCls}>Image URL</label>
              <input
                type="url"
                value={form.image_url}
                onChange={e => update('image_url', e.target.value)}
                placeholder="https://…"
                className={inputCls}
              />
              <p className="text-xs text-[#B3B3B3]/50 mt-2">Paste a URL from the Media Library</p>
              {form.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.image_url} alt="" className="mt-3 w-full aspect-video object-cover rounded-lg border border-white/[0.08]" />
              )}
            </div>
          </Card>
        </div>
      </div>
    </form>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#111111] p-6 space-y-4">
      <h2 className="text-[13px] font-semibold text-white">{title}</h2>
      {children}
    </div>
  )
}
