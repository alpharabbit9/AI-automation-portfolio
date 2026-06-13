'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Clock, Building2, Quote } from 'lucide-react'
import gsap from 'gsap'
import { EASE_OUT, prefersReducedMotion } from '@/lib/motion'
import type { CaseStudy, CaseStudyMetric } from '@/lib/types'

interface CaseStudiesProps {
  studies: CaseStudy[]
}

// ── Per-study enrichment (presentation layer) ────────────────
type StudyMeta = {
  problem_short: string
  solution_short: string
  before_after: Array<{ label: string; before: string; after: string }>
}

const STUDY_META: Record<string, StudyMeta> = {
  'saas-ai-sales-agent': {
    problem_short: 'Sales reps spent 4–6 hours daily on manual research, follow-ups, and CRM updates — leaving almost no time for actual selling.',
    solution_short: 'AI agent that qualifies inbound leads, drafts personalized outreach, and handles follow-up sequences autonomously.',
    before_after: [
      { label: 'Daily manual work',  before: '4–6 hours',  after: '< 30 min'    },
      { label: 'Qualified pipeline', before: 'Stagnant',   after: '+312%'        },
      { label: 'Close rate',         before: '18%',        after: '31%'          },
    ],
  },
  'logistics-invoice-automation': {
    problem_short: '800+ invoices processed manually each week. 4.2% error rate and 3 full-time staff consumed by reconciliation.',
    solution_short: 'AI document pipeline with OCR extraction, Claude-powered validation, and direct ERP auto-posting.',
    before_after: [
      { label: 'Processing time',  before: '45 min/invoice', after: '< 2 min'    },
      { label: 'Error rate',       before: '4.2%',           after: '0.3%'       },
      { label: 'Annual savings',   before: '—',              after: '$180K'      },
    ],
  },
  'agency-lead-generation-system': {
    problem_short: 'No outbound system. Founders spending 15+ hours weekly manually sourcing leads with poor targeting and low conversion.',
    solution_short: 'Multi-channel pipeline: scrape → AI enrich → intent score → personalised outreach at scale.',
    before_after: [
      { label: 'Leads / month',   before: '~30 manual',  after: '500+ auto'    },
      { label: 'Reply rate',      before: '1–2%',        after: '8%'           },
      { label: 'Time spent',      before: '15 hrs/week', after: '< 1 hr/week'  },
    ],
  },
  'ecommerce-operations-dashboard': {
    problem_short: '3-hour daily report compilation across 7 disconnected tools. Decisions made on day-old data.',
    solution_short: 'Unified real-time dashboard with automated anomaly detection and instant Slack threshold alerts.',
    before_after: [
      { label: 'Decision latency', before: '24 hours',   after: '5 minutes'    },
      { label: 'Report prep',      before: '3 hrs/day',  after: 'Automated'    },
      { label: 'ROAS',             before: 'Baseline',   after: '+34%'         },
    ],
  },
}

// ── Filter configuration ──────────────────────────────────────
const FILTERS = [
  { key: 'All',        test: () => true                                               },
  { key: 'SaaS',       test: (s: CaseStudy) => s.client_industry.includes('SaaS')     },
  { key: 'Logistics',  test: (s: CaseStudy) => s.client_industry.includes('Logistics')},
  { key: 'Marketing',  test: (s: CaseStudy) => s.client_industry.includes('Marketing')},
  { key: 'E-commerce', test: (s: CaseStudy) => s.client_industry.includes('E-commerce')},
] as const

type FilterKey = typeof FILTERS[number]['key']

// ── Abstract mockup UIs ───────────────────────────────────────
function MockupChrome({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-[#0A0A0A]">
      <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-white/[0.06] bg-[#0D0D0D]">
        {[0.14, 0.09, 0.06].map((o, i) => (
          <div key={i} className="w-2 h-2 rounded-full" style={{ background: `rgba(255,255,255,${o})` }} />
        ))}
        <div className="flex-1 ml-2 h-[18px] rounded-md bg-white/[0.04] flex items-center px-2">
          <span className="text-[8px] text-white/20 font-mono truncate">{url}</span>
        </div>
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}

function SalesMockup() {
  const cols = [
    { label: 'Qualified', dot: '#00E5FF', items: [['Sarah K.', 'TechCorp', '94%'], ['Marcus P.', 'DataFlow', '88%']] },
    { label: 'Contacted', dot: '#8B5CF6', items: [['Alicia R.', 'CloudBase', '91%'], ['James L.', 'ScaleUp', '79%']] },
    { label: 'Replied',   dot: '#10B981', items: [['Tom H.', 'GrowthOS', '96%']] },
  ]
  return (
    <MockupChrome url="app.crm.ai/pipeline">
      <div className="flex gap-2">
        {cols.map(col => (
          <div key={col.label} className="flex-1 space-y-1.5">
            <div className="flex items-center gap-1 mb-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: col.dot }} />
              <span className="text-[8px] font-medium text-white/40 uppercase tracking-wider">{col.label}</span>
            </div>
            {col.items.map(([name, company, score]) => (
              <div key={name} className="bg-[#161616] border border-white/[0.05] rounded-lg p-2">
                <div className="text-[8px] font-semibold text-white/70 truncate">{name}</div>
                <div className="text-[7px] text-white/30 truncate">{company}</div>
                <div className="flex items-center gap-1 mt-1.5">
                  <div className="h-[3px] flex-1 rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full bg-[#00E5FF]/50" style={{ width: score }} />
                  </div>
                  <span className="text-[7px] text-[#00E5FF]/50 flex-shrink-0">{score}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </MockupChrome>
  )
}

function InvoiceMockup() {
  const rows = [
    { name: 'INV-2024-0851', amount: '$4,280', status: 'Posted',     color: '#10B981' },
    { name: 'INV-2024-0850', amount: '$11,640', status: 'Posted',    color: '#10B981' },
    { name: 'INV-2024-0849', amount: '$2,910',  status: 'Posting…',  color: '#00E5FF' },
    { name: 'INV-2024-0848', amount: '$7,350',  status: 'Validating', color: '#8B5CF6' },
  ]
  return (
    <MockupChrome url="erp.internal/invoices/queue">
      <div className="space-y-0">
        <div className="flex items-center gap-2 pb-2 mb-1 border-b border-white/[0.05]">
          <span className="text-[8px] text-white/25 uppercase tracking-wider flex-1">Invoice</span>
          <span className="text-[8px] text-white/25 uppercase tracking-wider w-16 text-right">Amount</span>
          <span className="text-[8px] text-white/25 uppercase tracking-wider w-16 text-right">Status</span>
        </div>
        {rows.map(r => (
          <div key={r.name} className="flex items-center gap-2 py-2 border-b border-white/[0.04] last:border-0">
            <span className="text-[8px] font-mono text-white/45 flex-1 truncate">{r.name}</span>
            <span className="text-[8px] font-medium text-white/60 w-16 text-right">{r.amount}</span>
            <span className="text-[7px] font-medium w-16 text-right" style={{ color: r.color }}>{r.status}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 pt-2 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[7px] text-white/25">Automation running · 847 processed today</span>
        </div>
      </div>
    </MockupChrome>
  )
}

function LeadGenMockup() {
  const steps = [
    { label: 'LinkedIn + Apollo Scraper',  count: '2,400 sourced',   color: '#8B5CF6' },
    { label: 'AI Enrichment & Scoring',    count: '1,847 enriched',  color: '#00E5FF' },
    { label: 'Intent Filter (score ≥ 75)', count: '612 qualified',   color: '#10B981' },
    { label: 'Personalised Email Sent',    count: '500 / month',     color: '#F59E0B' },
  ]
  return (
    <MockupChrome url="app.leadgen.ai/pipeline">
      <div className="space-y-1">
        {steps.map((step, i) => (
          <div key={step.label}>
            <div className="flex items-center gap-2 bg-[#111111] border border-white/[0.05] rounded-lg px-2.5 py-2">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: step.color }} />
              <div className="flex-1 min-w-0">
                <div className="text-[8px] font-medium text-white/65 truncate">{step.label}</div>
                <div className="text-[7px] text-white/30 mt-0.5">{step.count}</div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="ml-[0.875rem] flex items-center gap-1 py-0.5">
                <div className="w-px h-3 bg-white/[0.08]" />
                <span className="text-[6px] text-white/15">↓</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </MockupChrome>
  )
}

function DashboardMockup() {
  const metrics = [
    { label: 'Revenue',  value: '$148K', change: '+23%' },
    { label: 'Orders',   value: '3,847', change: '+12%' },
    { label: 'ROAS',     value: '4.8×',  change: '+34%' },
  ]
  const bars = [42, 58, 51, 76, 69, 88, 82]
  return (
    <MockupChrome url="ops.dashboard.co/overview">
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-1.5">
          {metrics.map(m => (
            <div key={m.label} className="bg-[#111111] border border-white/[0.05] rounded-lg p-2">
              <div className="text-[7px] text-white/25 uppercase tracking-wider">{m.label}</div>
              <div className="text-[11px] font-semibold text-white mt-0.5">{m.value}</div>
              <div className="text-[7px] text-emerald-400">{m.change}</div>
            </div>
          ))}
        </div>
        <div className="bg-[#111111] border border-white/[0.05] rounded-lg p-2.5">
          <div className="text-[7px] text-white/25 uppercase tracking-wider mb-2">7-Day Revenue Trend</div>
          <div className="flex items-end gap-1 h-9">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${h}%`,
                  background: i === bars.length - 1
                    ? 'rgba(0,229,255,0.5)'
                    : 'rgba(0,229,255,0.18)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </MockupChrome>
  )
}

const MOCKUPS: Record<string, React.FC> = {
  'saas-ai-sales-agent':           SalesMockup,
  'logistics-invoice-automation':  InvoiceMockup,
  'agency-lead-generation-system': LeadGenMockup,
  'ecommerce-operations-dashboard': DashboardMockup,
}

function StudyMockup({ slug }: { slug: string }) {
  const Comp = MOCKUPS[slug] ?? SalesMockup
  return <Comp />
}

// ── Before / After table ──────────────────────────────────────
function BeforeAfterTable({ items }: { items: StudyMeta['before_after'] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08]">
      {/* Header */}
      <div className="grid grid-cols-[1fr_22px_1fr]">
        <div className="px-3 py-2 bg-white/[0.03] border-b border-white/[0.07]">
          <span className="text-[9px] tracking-widest uppercase text-white/25 font-medium">Before</span>
        </div>
        <div className="bg-white/[0.03] border-b border-white/[0.07]" />
        <div className="px-3 py-2 border-b border-white/[0.07] border-l border-l-[#00E5FF]/[0.1] bg-[#00E5FF]/[0.04]">
          <span className="text-[9px] tracking-widest uppercase text-[#00E5FF]/45 font-medium">After</span>
        </div>
      </div>

      {items.map((item, i) => (
        <div key={i} className={`grid grid-cols-[1fr_22px_1fr] ${i < items.length - 1 ? 'border-b border-white/[0.06]' : ''}`}>
          <div className="px-3 py-3 space-y-0.5">
            <div className="text-[8px] text-white/20 uppercase tracking-wider">{item.label}</div>
            <div className="text-xs text-white/40 line-through decoration-white/20">{item.before}</div>
          </div>
          <div className="flex items-center justify-center border-x border-white/[0.06]">
            <ArrowRight className="w-2.5 h-2.5 text-white/15" />
          </div>
          <div className="px-3 py-3 space-y-0.5 bg-[#00E5FF]/[0.025]">
            <div className="text-[8px] text-[#00E5FF]/30 uppercase tracking-wider">{item.label}</div>
            <div className="text-xs font-semibold text-white">{item.after}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Featured card (full storytelling layout) ──────────────────
function FeaturedCard({ study }: { study: CaseStudy }) {
  const meta = STUDY_META[study.slug]

  return (
    <div className="relative rounded-2xl border border-white/[0.08] bg-[#111111] overflow-hidden">
      {/* Accent top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/45 to-transparent" />

      {/* Background glow */}
      <div
        className="absolute top-0 left-1/3 w-96 h-64 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,229,255,0.04) 0%, transparent 70%)',
          filter: 'blur(48px)',
        }}
      />

      <div className="relative p-7 lg:p-9 xl:p-10">
        {/* ── Top meta row ── */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {study.tags.slice(0, 3).map(t => (
            <span key={t} className="tag text-[9px]">{t}</span>
          ))}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium text-[#B3B3B3] bg-white/[0.04] border border-white/[0.06]">
            <Building2 className="w-3 h-3 opacity-50" />
            {study.client_industry}
          </span>
          {study.duration && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium text-[#B3B3B3] bg-white/[0.04] border border-white/[0.06]">
              <Clock className="w-3 h-3 opacity-50" />
              {study.duration}
            </span>
          )}
          <Link
            href={`/case-studies/${study.slug}`}
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-[#B3B3B3] hover:text-white transition-colors group"
          >
            Read full case study
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* ── Full-width title ── */}
        <h3 className="text-2xl lg:text-3xl xl:text-[2rem] font-semibold text-white tracking-tight leading-tight mb-8 max-w-4xl">
          {study.title}
        </h3>

        {/* ── Two columns: mockup | narrative ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-8">
          {/* Left: mockup */}
          <StudyMockup slug={study.slug} />

          {/* Right: problem → solution → before/after */}
          <div className="flex flex-col gap-5">
            {/* Problem */}
            <div>
              <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-white/25 mb-2">
                Problem
              </p>
              <p className="text-sm text-[#B3B3B3] leading-relaxed">
                {meta?.problem_short ?? study.challenge.slice(0, 160) + '…'}
              </p>
            </div>

            {/* Solution */}
            <div>
              <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-white/25 mb-2">
                Solution
              </p>
              <p className="text-sm text-[#B3B3B3] leading-relaxed">
                {meta?.solution_short ?? study.solution.slice(0, 160) + '…'}
              </p>
            </div>

            {/* Before / After */}
            {meta?.before_after && <BeforeAfterTable items={meta.before_after} />}

            {/* Testimonial (if exists) */}
            {study.testimonial_quote && (
              <div className="flex gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <Quote className="w-3.5 h-3.5 text-[#00E5FF]/30 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[#B3B3B3] italic leading-relaxed line-clamp-2">
                    {study.testimonial_quote}
                  </p>
                  {study.testimonial_role && (
                    <p className="text-[10px] text-white/25 mt-1.5">— {study.testimonial_role}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Metrics row (full width) ── */}
        <div className={`grid gap-3 mt-8 pt-6 border-t border-white/[0.06] ${
          study.metrics.length === 3 ? 'grid-cols-3' :
          study.metrics.length === 2 ? 'grid-cols-2' : 'grid-cols-1'
        }`}>
          {study.metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE_OUT }}
              className="bg-[#0D0D0D] border border-white/[0.06] rounded-xl px-5 py-4 space-y-1"
            >
              <div className="text-2xl lg:text-3xl font-semibold tracking-tight text-white">
                {m.value}
              </div>
              <div className="text-xs text-[#B3B3B3]">{m.label}</div>
              {m.description && (
                <div className="text-[10px] text-white/25">{m.description}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Grid study card ───────────────────────────────────────────
function StudyCard({ study, delay }: { study: CaseStudy; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE_OUT }}
      whileHover={{
        scale: 1.02,
        y: -4,
        boxShadow: '0 0 0 1px rgba(0,229,255,0.1), 0 20px 48px rgba(0,0,0,0.4)',
        transition: { type: 'spring', stiffness: 350, damping: 30 },
      }}
      className="group relative rounded-2xl border border-white/[0.08] bg-[#111111] overflow-hidden cursor-default"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      <Link href={`/case-studies/${study.slug}`} className="block p-6 h-full">
        {/* Tags + duration */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {study.tags.slice(0, 2).map(t => (
            <span key={t} className="tag text-[9px]">{t}</span>
          ))}
          {study.duration && (
            <span className="ml-auto text-[9px] text-white/25 font-mono">{study.duration}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold text-white tracking-tight leading-snug mb-3 line-clamp-2">
          {study.title}
        </h3>

        {/* Problem one-liner */}
        <p className="text-xs text-[#B3B3B3] leading-relaxed mb-5 line-clamp-2">
          {STUDY_META[study.slug]?.problem_short ?? study.challenge.slice(0, 100) + '…'}
        </p>

        {/* Metrics */}
        <div className="flex gap-5 pt-4 border-t border-white/[0.06] mb-4">
          {study.metrics.slice(0, 2).map(m => (
            <div key={m.label} className="space-y-0.5">
              <div className="text-xl font-semibold tracking-tight text-white">{m.value}</div>
              <div className="text-[9px] text-[#B3B3B3]">{m.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-[#B3B3B3] group-hover:text-white transition-colors duration-200">
          <span>Read case study</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </Link>
    </motion.div>
  )
}

// ── Main section ──────────────────────────────────────────────
export default function CaseStudies({ studies }: CaseStudiesProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef   = useRef<HTMLSpanElement>(null)
  const titleRef   = useRef<HTMLHeadingElement>(null)
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All')

  // GSAP header reveal
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        if (prefersReducedMotion()) return
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.fromTo(labelRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 })
        const lines = titleRef.current?.querySelectorAll<HTMLElement>('.cs-line > span')
        if (lines?.length) {
          tl.fromTo(lines, { yPercent: 108, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.1, duration: 0.85 }, '-=0.1')
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const published = studies.filter(s => s.is_published)
  const activeTestFn = FILTERS.find(f => f.key === activeFilter)?.test ?? (() => true)
  const filtered = published.filter(activeTestFn)
  const featured  = filtered.find(s => s.featured) ?? filtered[0]
  const gridStudies = filtered.filter(s => s.id !== featured?.id)

  return (
    <section id="case-studies" ref={sectionRef} aria-labelledby="case-studies-heading" className="py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mb-12 lg:mb-14">
          <span ref={labelRef} className="section-label block mb-5" style={{ opacity: 0 }}>
            Case Studies
          </span>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <h2
              id="case-studies-heading"
              ref={titleRef}
              className="text-[clamp(2rem,4.5vw,3.75rem)] font-semibold tracking-[-0.03em]"
            >
              <div className="cs-line overflow-hidden" style={{ lineHeight: 1.1 }}>
                <span className="block text-white">Real Results.</span>
              </div>
              <div className="cs-line overflow-hidden" style={{ lineHeight: 1.1 }}>
                <span className="block accent-gradient-text">Real Businesses.</span>
              </div>
            </h2>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Filter tabs */}
              <div
                className="flex items-center gap-0.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                role="group"
                aria-label="Filter case studies by industry"
              >
                {FILTERS.map(f => (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    aria-pressed={activeFilter === f.key}
                    className={`relative px-3 py-1.5 text-[11px] font-medium rounded-lg transition-colors duration-150 ${
                      activeFilter === f.key ? 'text-white' : 'text-[#B3B3B3] hover:text-white/70'
                    }`}
                  >
                    {activeFilter === f.key && (
                      <motion.div
                        layoutId="filter-bg"
                        className="absolute inset-0 rounded-lg bg-white/[0.08]"
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative">{f.key}</span>
                  </button>
                ))}
              </div>

              <Link
                href="/case-studies"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B3B3B3] hover:text-white transition-colors group"
              >
                View all
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Featured card ── */}
        {featured ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`featured-${featured.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="mb-5"
            >
              <FeaturedCard study={featured} />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="mb-5 rounded-2xl border border-white/[0.06] bg-[#111111] p-12 text-center">
            <p className="text-sm text-[#B3B3B3]">No case studies for this category yet.</p>
          </div>
        )}

        {/* ── Grid ── */}
        {gridStudies.length > 0 && (
          <div
            key={`grid-${activeFilter}`}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5"
          >
            {gridStudies.map((study, i) => (
              <StudyCard key={study.id} study={study} delay={i * 0.08} />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
