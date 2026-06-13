'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { EASE_OUT, prefersReducedMotion } from '@/lib/motion'
import type { HeroContent } from '@/lib/types'

interface HeroProps {
  content: HeroContent
}

const STATS = [
  { value: '25+',     label: 'Automations Delivered'        },
  { value: '1,000+',  label: 'Hours Saved'                  },
  { value: '15+',     label: 'Businesses Helped'            },
  { value: '80%',     label: 'Response Time Improvement'    },
] as const

const HEADLINE_LINES = [
  'AI Systems That Save Time,',
  'Reduce Costs &',
  'Scale Operations.',
] as const

// ── Portrait card ─────────────────────────────────────────────
function PortraitCard() {
  return (
    <div className="relative">
      {/* Floating glow behind card */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: '-32px',
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,229,255,0.08) 0%, transparent 70%)',
          filter: 'blur(16px)',
        }}
      />

      {/* Card */}
      <motion.div
        className="relative rounded-[24px] overflow-hidden border border-white/[0.08] bg-[#111111]"
        initial={{ opacity: 0, x: 28, scale: 0.97 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1.0, delay: 0.55, ease: EASE_OUT }}
        whileHover={{
          scale: 1.012,
          boxShadow:
            '0 0 0 1px rgba(0,229,255,0.12), 0 32px 64px rgba(0,0,0,0.55), 0 0 80px rgba(0,229,255,0.06)',
          transition: { type: 'spring', stiffness: 280, damping: 28 },
        }}
      >
        {/* Portrait */}
        <div className="relative w-full" style={{ aspectRatio: '4/5' }}>
          <Image
            src="/rifat.png"
            alt="Rifat Ahmed — AI Automation Consultant"
            fill
            priority
            sizes="(max-width: 1024px) 80vw, 400px"
            className="object-cover"
            style={{
              objectPosition: 'center 8%',
              filter: 'contrast(1.07) brightness(0.86) saturate(0.88)',
            }}
          />

          {/* Subtle top vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(0,0,0,0.25) 0%, transparent 60%)',
            }}
          />

          {/* Bottom gradient — bleeds into card bg */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: '45%',
              background:
                'linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.55) 35%, transparent 100%)',
            }}
          />

          {/* Name / role overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 pb-6">
            <p className="text-[15px] font-semibold text-white tracking-tight leading-snug">
              Rifat Ahmed
            </p>
            <p className="text-xs text-[#B3B3B3] mt-0.5 tracking-wide">
              AI Automation Consultant
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const fadeBlur = (delay: number, duration = 0.7) => ({
  initial: { opacity: 0, filter: 'blur(8px)', y: 10 } as const,
  animate: { opacity: 1, filter: 'blur(0px)', y: 0 } as const,
  transition: { duration, delay, ease: EASE_OUT },
})

// ── Main hero ─────────────────────────────────────────────────
export default function Hero({ content }: HeroProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!headlineRef.current) return
    if (prefersReducedMotion()) return
    const lines = headlineRef.current.querySelectorAll<HTMLElement>('.hl-line > span')
    gsap.fromTo(lines,
      { yPercent: 115, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.13, ease: 'power4.out', delay: 0.2 },
    )
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Dot grid */}
      <div className="absolute inset-0 dot-bg opacity-40" />

      {/* Ambient glows */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-15%', left: '-5%', width: '65%', height: '75%',
          background: 'radial-gradient(ellipse at center, rgba(0,229,255,0.045) 0%, transparent 65%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '5%', right: '-10%', width: '45%', height: '55%',
          background: 'radial-gradient(ellipse at center, rgba(0,229,255,0.025) 0%, transparent 65%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full py-24 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-10 lg:gap-16 xl:gap-20 items-center">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-8 lg:gap-10">

            {/* Availability badge */}
            <motion.div {...fadeBlur(0.05, 0.5)}>
              <span className="tag">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                Available for new projects
              </span>
            </motion.div>

            {/* Headline — GSAP mask reveal */}
            <h1
              ref={headlineRef}
              className="text-[clamp(2.2rem,5.2vw,4.75rem)] font-semibold tracking-[-0.03em]"
              aria-label={HEADLINE_LINES.join(' ')}
            >
              {HEADLINE_LINES.map((line, i) => (
                <div key={i} className="hl-line overflow-hidden" style={{ lineHeight: 1.08 }}>
                  <span className={`block ${i === 2 ? 'accent-gradient-text' : 'text-white'}`}>
                    {line}
                  </span>
                </div>
              ))}
            </h1>

            {/* Subheadline */}
            <motion.p
              {...fadeBlur(0.58)}
              className="text-[17px] lg:text-lg text-[#B3B3B3] leading-relaxed max-w-[500px]"
            >
              {content.description}
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeBlur(0.72, 0.6)} className="flex flex-wrap gap-3">
              <Link
                href={content.cta_primary_href}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#0A0A0A] bg-white rounded-xl hover:bg-white/90 transition-all duration-200 group"
              >
                {content.cta_primary_text}
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={content.cta_secondary_href}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-white border border-white/[0.12] rounded-xl hover:bg-white/[0.04] hover:border-white/20 transition-all duration-200 group"
              >
                {content.cta_secondary_text}
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>

            {/* Portrait — mobile only (between CTAs and stats) */}
            <div className="lg:hidden">
              <PortraitCard />
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5 pt-6 border-t border-white/[0.06]"
            >
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.92 + i * 0.07, ease: EASE_OUT }}
                  className="space-y-1"
                >
                  <div className="text-2xl lg:text-[1.75rem] font-semibold tracking-tight text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#B3B3B3] leading-tight">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── Right column — desktop portrait ── */}
          <div className="hidden lg:block">
            <PortraitCard />
          </div>
        </div>
      </div>

      {/* Scroll line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent"
        />
      </motion.div>
    </section>
  )
}
