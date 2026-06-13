import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { caseStudies } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'Real business outcomes from AI automation engagements — measurable results, transparent process, honest numbers.',
}

export default function CaseStudiesPage() {
  const published = caseStudies.filter(s => s.is_published)

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="mb-16 pt-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#B3B3B3] hover:text-white transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            <span className="section-label mb-4 block">Case Studies</span>
            <h1 className="text-5xl lg:text-7xl font-semibold tracking-tight text-white mb-6">
              Real Results
            </h1>
            <p className="text-xl text-[#B3B3B3] max-w-xl leading-relaxed">
              Every case study represents a real business problem solved with measurable outcomes. No vanity metrics.
            </p>
          </div>

          {/* Studies Grid */}
          <div className="space-y-4">
            {published.map((study, i) => (
              <Link key={study.id} href={`/case-studies/${study.slug}`}>
                <div className="group rounded-2xl border border-white/[0.08] bg-[#111111] p-8 lg:p-10 hover:border-white/[0.14] hover:bg-[#161616] transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left: Content */}
                    <div className="lg:col-span-3">
                      <div className="flex flex-wrap gap-2 mb-5">
                        {study.tags.map(tag => (
                          <span key={tag} className="tag text-[10px]">{tag}</span>
                        ))}
                        {study.duration && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium text-[#B3B3B3] bg-white/[0.04] border border-white/[0.06]">
                            {study.duration}
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4 tracking-tight leading-snug">
                        {study.title}
                      </h2>
                      <p className="text-[#B3B3B3] leading-relaxed line-clamp-3">
                        {study.results}
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-sm text-[#B3B3B3] group-hover:text-white transition-colors">
                        <span>Read full case study</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>

                    {/* Right: Metrics */}
                    <div className="lg:col-span-2 flex flex-wrap gap-8 lg:justify-end lg:items-start">
                      {study.metrics.map(m => (
                        <div key={m.label} className="flex flex-col gap-1">
                          <span className="text-3xl font-semibold tracking-tight text-white">{m.value}</span>
                          <span className="text-xs text-[#B3B3B3] font-medium">{m.label}</span>
                          {m.description && (
                            <span className="text-[10px] text-[#B3B3B3]/60">{m.description}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="text-[#B3B3B3] mb-6">
              Want results like these for your business?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#0A0A0A] bg-white rounded-xl hover:bg-white/90 transition-all"
            >
              Book a Discovery Call
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
