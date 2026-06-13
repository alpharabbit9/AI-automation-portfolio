'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { EASE_OUT, prefersReducedMotion } from '@/lib/motion'

const STEPS = [
  {
    number: '01',
    title: 'Discovery',
    tagline: 'Map what\'s costing you time and money.',
    description: 'A 60-minute deep dive into your operations. We identify your highest-leverage automation opportunities, define clear success metrics, and establish what "done" looks like — before anything gets built.',
  },
  {
    number: '02',
    title: 'Strategy',
    tagline: 'Design the full architecture before writing code.',
    description: 'I map the complete system — data flows, integration points, AI model selection, error handling, and edge cases. You get a clear technical blueprint and a phased delivery plan with no surprises.',
  },
  {
    number: '03',
    title: 'Build',
    tagline: 'Iterative delivery with weekly demos.',
    description: 'Development happens in tight, focused sprints. You see working software every week, give direct feedback, and we adjust in real time. No black-box development. No 8-week wait for a reveal.',
  },
  {
    number: '04',
    title: 'Testing',
    tagline: 'Validated against your real edge cases.',
    description: 'QA runs against actual data and real-world failure modes — not just happy paths. Every integration point is stress-tested, error states are handled, and fallbacks confirmed before anything goes live.',
  },
  {
    number: '05',
    title: 'Launch',
    tagline: 'Deployed with documentation and monitoring.',
    description: 'Production deployment with runbooks, monitoring dashboards, and alert thresholds configured from day one. Your team gets a handoff session so they understand what\'s running and why.',
  },
  {
    number: '06',
    title: 'Support',
    tagline: '30 days of optimization. Then async availability.',
    description: 'I stay engaged for 30 days post-launch to tune performance, handle production edge cases, and ensure the system hits its target metrics. Ongoing support is available for clients who need it.',
  },
]

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef   = useRef<HTMLSpanElement>(null)
  const titleRef   = useRef<HTMLHeadingElement>(null)
  const lineRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        if (prefersReducedMotion()) return

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        tl.fromTo(
          labelRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4 },
        )

        const lines = titleRef.current?.querySelectorAll<HTMLElement>('.proc-line > span')
        if (lines?.length) {
          tl.fromTo(
            lines,
            { yPercent: 108, opacity: 0 },
            { yPercent: 0, opacity: 1, stagger: 0.1, duration: 0.85 },
            '-=0.1',
          )
        }

        tl.fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: 'top center' },
          { scaleY: 1, duration: 2.2, ease: 'power2.inOut' },
          '-=0.65',
        )
      },
      { threshold: 0.08 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="process"
      className="py-24 lg:py-32 border-t border-white/[0.06] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16 lg:mb-20">
          <span
            ref={labelRef}
            className="section-label block mb-5"
            style={{ opacity: 0 }}
          >
            How It Works
          </span>
          <h2
            ref={titleRef}
            className="text-[clamp(2rem,4.5vw,3.75rem)] font-semibold tracking-[-0.03em] max-w-2xl"
          >
            <div className="proc-line overflow-hidden" style={{ lineHeight: 1.1 }}>
              <span className="block text-white">From Problem</span>
            </div>
            <div className="proc-line overflow-hidden" style={{ lineHeight: 1.1 }}>
              <span className="block accent-gradient-text">to Production.</span>
            </div>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative pl-10 lg:pl-14">

          {/* Vertical progress line */}
          <div className="absolute left-[15px] lg:left-[19px] top-3 bottom-20 w-px bg-white/[0.06]">
            <div
              ref={lineRef}
              className="absolute inset-0 origin-top"
              style={{
                background: 'linear-gradient(to bottom, rgba(0,229,255,0.55) 0%, rgba(0,229,255,0.2) 60%, transparent 100%)',
                transform: 'scaleY(0)',
              }}
            />
          </div>

          <div className="space-y-0">
            {STEPS.map((step, i) => (
              <div key={step.number}>
                {/* Row */}
                <div className="relative flex gap-0">
                  {/* Dot — sits on the line */}
                  <motion.div
                    className="absolute -left-10 lg:-left-14 top-1.5 z-10"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.35, delay: 0.05, ease: EASE_OUT }}
                  >
                    <div
                      className="w-[30px] h-[30px] lg:w-[38px] lg:h-[38px] rounded-full border border-white/[0.12] bg-[#0A0A0A] flex items-center justify-center"
                      style={{
                        boxShadow: '0 0 0 4px #0A0A0A, 0 0 14px rgba(0,229,255,0.1)',
                      }}
                    >
                      <span className="text-[9px] lg:text-[10px] font-bold tracking-widest text-[#00E5FF]/60">
                        {step.number}
                      </span>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: 0.08, ease: EASE_OUT }}
                    className="flex-1 pb-12 last:pb-0 grid grid-cols-1 lg:grid-cols-[220px_1fr] xl:grid-cols-[260px_1fr] gap-2 lg:gap-12"
                  >
                    {/* Title block */}
                    <div className="pt-0.5">
                      <h3 className="text-lg lg:text-xl font-semibold text-white tracking-tight mb-1">
                        {step.title}
                      </h3>
                      <p className="text-[12px] text-[#00E5FF]/60 font-medium leading-snug">
                        {step.tagline}
                      </p>
                    </div>

                    {/* Description */}
                    <div className="pt-0.5">
                      <p className="text-[#B3B3B3] text-[15px] leading-relaxed max-w-xl">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Separator (not after last) */}
                {i < STEPS.length - 1 && (
                  <div className="h-px bg-white/[0.04] mb-0 ml-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE_OUT }}
          className="mt-20 relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111111] px-8 py-10 lg:px-12 lg:py-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
        >
          {/* Background glow */}
          <div
            className="absolute top-0 right-0 w-80 h-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 80% 50%, rgba(0,229,255,0.04) 0%, transparent 65%)',
            }}
          />
          <div className="relative max-w-lg">
            <h3 className="text-2xl lg:text-3xl font-semibold tracking-tight text-white mb-2">
              Ready to see what&apos;s possible?
            </h3>
            <p className="text-[#B3B3B3] text-[15px]">
              Start with a free 30-minute discovery call. No obligation. No sales pitch. Just a conversation about your operations.
            </p>
          </div>
          <Link
            href="/contact"
            className="relative flex-shrink-0 inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#0A0A0A] bg-white rounded-xl hover:bg-white/90 transition-all group"
          >
            Book Discovery Call
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
