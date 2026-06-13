'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import gsap from 'gsap'
import { EASE_OUT, prefersReducedMotion } from '@/lib/motion'
import type { Testimonial } from '@/lib/types'

interface TestimonialsProps {
  testimonials: Testimonial[]
}

const TRUST_METRICS = [
  { value: '5.0', label: 'Average Rating', sub: 'Across all projects' },
  { value: '100%', label: 'Project Success', sub: 'On-time delivery' },
  { value: '15+', label: 'Satisfied Clients', sub: 'And growing' },
] as const

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3 h-3 ${i < rating ? 'text-[#00E5FF]' : 'text-white/10'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article
      className="flex-shrink-0 w-[340px] lg:w-[380px] rounded-2xl border border-white/[0.08] bg-[#111111] p-7 relative overflow-hidden mx-3"
      aria-label={`Testimonial from ${t.author_name}`}
    >
      {/* Subtle top border accent */}
      <div
        className="absolute top-0 left-8 right-8 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.15), transparent)',
        }}
        aria-hidden="true"
      />
      <Quote className="w-7 h-7 text-[#00E5FF]/15 mb-5 fill-[#00E5FF]/8" aria-hidden="true" />
      <blockquote className="text-white/85 text-[14px] leading-relaxed mb-6 line-clamp-4">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <footer className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-white/[0.08] flex items-center justify-center flex-shrink-0"
          aria-hidden="true"
        >
          <span className="text-xs font-semibold text-[#B3B3B3]">
            {t.author_name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <cite className="text-sm font-medium text-white not-italic truncate block">{t.author_name}</cite>
          <p className="text-xs text-[#B3B3B3] truncate">
            {t.author_role} · {t.author_company}
          </p>
        </div>
        <StarRating rating={t.rating} />
      </footer>
    </article>
  )
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef   = useRef<HTMLSpanElement>(null)
  const titleRef   = useRef<HTMLHeadingElement>(null)

  const active = testimonials.filter(t => t.is_active)

  // Build marquee tracks with enough copies for seamless loop
  const track1 = [...active, ...active, ...active, ...active]
  const track2 = [...active, ...active, ...active, ...active].reverse()

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

        const lines = titleRef.current?.querySelectorAll<HTMLElement>('.test-line > span')
        if (lines?.length) {
          tl.fromTo(
            lines,
            { yPercent: 108, opacity: 0 },
            { yPercent: 0, opacity: 1, stagger: 0.1, duration: 0.85 },
            '-=0.1',
          )
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  if (active.length === 0) return null

  return (
    <section
      ref={sectionRef}
      aria-labelledby="testimonials-heading"
      className="py-24 lg:py-32 border-t border-white/[0.06] overflow-hidden"
    >
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-fwd { animation: marquee-scroll 45s linear infinite; }
        .marquee-rev { animation: marquee-scroll 38s linear infinite reverse; }
        .marquee-wrap:hover .marquee-fwd,
        .marquee-wrap:hover .marquee-rev {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="mb-14 lg:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span
              ref={labelRef}
              className="section-label block mb-5"
              style={{ opacity: 0 }}
            >
              Social Proof
            </span>
            <h2
              id="testimonials-heading"
              ref={titleRef}
              className="text-[clamp(2rem,4.5vw,3.75rem)] font-semibold tracking-[-0.03em] max-w-xl"
            >
              <div className="test-line overflow-hidden" style={{ lineHeight: 1.1 }}>
                <span className="block text-white">Clients Don&apos;t Just</span>
              </div>
              <div className="test-line overflow-hidden" style={{ lineHeight: 1.1 }}>
                <span className="block accent-gradient-text">Come Back — They Refer.</span>
              </div>
            </h2>
          </div>

          {/* Trust metrics (top-right on desktop) */}
          <div className="flex gap-6 lg:gap-8 flex-shrink-0" aria-label="Trust metrics">
            {TRUST_METRICS.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07, ease: EASE_OUT }}
                className="text-right hidden lg:block"
              >
                <div className="text-2xl font-semibold tracking-tight text-white">{m.value}</div>
                <div className="text-xs text-[#B3B3B3]">{m.label}</div>
                <div className="text-[10px] text-[#B3B3B3]/50">{m.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile trust metrics */}
        <div className="flex gap-8 mb-12 lg:hidden" aria-label="Trust metrics">
          {TRUST_METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07, ease: EASE_OUT }}
            >
              <div className="text-xl font-semibold text-white">{m.value}</div>
              <div className="text-[11px] text-[#B3B3B3]">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Marquee (full bleed) — fades are siblings INSIDE the same relative wrapper ── */}
      <div
        className="marquee-wrap relative"
        aria-hidden="true"
        aria-label="Scrolling testimonials"
      >
        {/* Left edge fade */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 lg:w-40 z-10"
          style={{ background: 'linear-gradient(to right, #0A0A0A 0%, transparent 100%)' }}
        />
        {/* Right edge fade */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 lg:w-40 z-10"
          style={{ background: 'linear-gradient(to left, #0A0A0A 0%, transparent 100%)' }}
        />

        {/* Row 1 — forward */}
        <div className="overflow-hidden py-3">
          <div className="marquee-fwd flex w-max">
            {track1.map((t, i) => (
              <TestimonialCard key={`fwd-${t.id}-${i}`} t={t} />
            ))}
          </div>
        </div>

        {/* Row 2 — reverse */}
        <div className="overflow-hidden py-3">
          <div className="marquee-rev flex w-max">
            {track2.map((t, i) => (
              <TestimonialCard key={`rev-${t.id}-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}
