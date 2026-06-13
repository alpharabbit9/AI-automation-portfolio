'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { prefersReducedMotion } from '@/lib/motion'

const SKILLS = [
  'AI Automation',
  'n8n Workflows',
  'CRM Integrations',
  'Internal Tools',
  'Dashboards',
] as const

export default function FounderCard() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRef    = useRef<HTMLDivElement>(null)
  const leftRef    = useRef<HTMLDivElement>(null)
  const rightRef   = useRef<HTMLDivElement>(null)
  const lineRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        if (prefersReducedMotion()) return

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        tl.fromTo(
          leftRef.current,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6 },
        )
        tl.fromTo(
          lineRef.current,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.5 },
          '-=0.2',
        )
        tl.fromTo(
          rightRef.current,
          { opacity: 0, x: 20, filter: 'blur(6px)' },
          { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.65 },
          '-=0.35',
        )
      },
      { threshold: 0.25 },
    )

    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={sectionRef} className="max-w-7xl mt-16 mx-auto px-6 lg:px-8 pb-8">
      <motion.div
        ref={cardRef}
        whileHover={{
          borderColor: 'rgba(255,255,255,0.13)',
          boxShadow: '0 0 0 1px rgba(0,229,255,0.06), 0 20px 60px rgba(0,0,0,0.35)',
          transition: { duration: 0.3 },
        }}
        className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111111] px-6 py-7 md:px-8 md:py-8 transition-colors duration-300"
      >
        {/* Background glow */}
        <div
          className="absolute top-0 left-1/4 w-80 h-40 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,229,255,0.04) 0%, transparent 70%)',
            filter: 'blur(32px)',
          }}
        />

        <div className="relative flex flex-col md:flex-row md:items-center gap-7 md:gap-0">

          {/* ── Left: identity ── */}
          <div
            ref={leftRef}
            className="flex items-center gap-4 md:pr-8 flex-shrink-0"
            style={{ opacity: 0 }}
          >
            {/* Circle portrait */}
            <div className="relative flex-shrink-0">
              {/* Cyan ring */}
              <div className="absolute -inset-[3px] rounded-full bg-gradient-to-br from-[#00E5FF]/30 via-transparent to-[#00E5FF]/10" />
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-white/[0.08]">
                <Image
                  src="/rifat.png"
                  alt="Rifat Ahmed"
                  fill
                  sizes="56px"
                  className="object-cover"
                  style={{
                    objectPosition: 'center 8%',
                    filter: 'contrast(1.07) brightness(0.9) saturate(0.88)',
                  }}
                />
              </div>
            </div>

            {/* Name / role */}
            <div>
              <p className="text-sm font-semibold text-white tracking-tight">Rifat Ahmed</p>
              <p className="text-xs text-[#B3B3B3] mt-0.5 leading-snug">
                AI Automation Consultant
                <br />
                &amp; Builder
              </p>
            </div>
          </div>

          {/* ── Divider ── */}
          <div
            ref={lineRef}
            className="hidden md:block flex-shrink-0 w-px self-stretch bg-white/[0.07]"
            style={{ transform: 'scaleX(0)', transformOrigin: 'top center' }}
          />
          {/* Mobile divider */}
          <div className="md:hidden h-px bg-white/[0.07] w-full" />

          {/* ── Right: bio + skills ── */}
          <div
            ref={rightRef}
            className="flex-1 md:pl-8 space-y-4"
            style={{ opacity: 0 }}
          >
            <p className="text-[#B3B3B3] text-sm leading-relaxed max-w-2xl">
              Building AI systems and automations that help businesses{' '}
              <span className="text-white/80">save time</span>,{' '}
              <span className="text-white/80">reduce operational costs</span> and{' '}
              <span className="text-white/80">scale efficiently</span> — without adding headcount
              or complexity.
            </p>

            {/* Skill pills */}
            <div className="flex flex-wrap gap-2">
              {SKILLS.map(skill => (
                <motion.span
                  key={skill}
                  whileHover={{ borderColor: 'rgba(0,229,255,0.25)', color: '#fff' }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex items-center px-3 py-1 text-[11px] font-medium tracking-wide border border-white/[0.08] rounded-full text-[#B3B3B3] bg-white/[0.03] cursor-default transition-colors duration-150"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  )
}
