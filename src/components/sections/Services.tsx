'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bot, Workflow, Users, Layers, BarChart3, Target, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { EASE_OUT, prefersReducedMotion } from '@/lib/motion'
import type { Service } from '@/lib/types'

interface ServicesProps {
  services: Service[]
}

// Presentation-layer metadata — outcome copy + icon, indexed to match services order
const SERVICE_META = [
  { Icon: Bot,       outcome: 'Save 20–40 hours of manual work every week'         },
  { Icon: Workflow,  outcome: 'Eliminate manual handoffs across your entire stack'  },
  { Icon: Users,     outcome: 'Always-accurate data across every touchpoint'        },
  { Icon: Layers,    outcome: 'One source of truth for your entire operation'       },
  { Icon: BarChart3, outcome: 'Real-time decisions backed by live data'             },
  { Icon: Target,    outcome: '3× more qualified leads with the same headcount'     },
] as const

// Alternating bento: [2,1] [1,2] [1,2] — 9 cells across 3 columns, 3 rows
const BENTO_SPAN = [
  'lg:col-span-2',  // 0 AI Agents   — wide
  'lg:col-span-1',  // 1 Workflow    — narrow
  'lg:col-span-1',  // 2 CRM         — narrow
  'lg:col-span-2',  // 3 Int Tools   — wide
  'lg:col-span-1',  // 4 Dashboard   — narrow
  'lg:col-span-2',  // 5 Lead Gen    — wide
] as const

// Variants propagate from card → icon + outcome arrow
const hoverCard = {
  rest:  { scale: 1,    y: 0 },
  hover: { scale: 1.02, y: -4 },
}
const hoverIcon = {
  rest:  { scale: 1,    rotate: 0  },
  hover: { scale: 1.08, rotate: -5 },
}
const hoverOutcome = {
  rest:  { x: 0 },
  hover: { x: 4 },
}

interface CardProps {
  service: Service
  index:   number
  delay:   number
}

function ServiceCard({ service, index, delay }: CardProps) {
  const meta   = SERVICE_META[index] ?? SERVICE_META[0]
  const { Icon, outcome } = meta
  const isWide = BENTO_SPAN[index] === 'lg:col-span-2'

  // Glow blob position alternates per card for visual rhythm
  const glowClass = index % 2 === 0
    ? 'top-0 right-0 translate-x-1/3 -translate-y-1/3'
    : 'bottom-0 left-0 -translate-x-1/3 translate-y-1/3'

  return (
    // Outer: holds grid span + hover spring
    <motion.div
      className={`relative rounded-2xl border border-white/[0.08] bg-[#111111] overflow-hidden cursor-default ${BENTO_SPAN[index]}`}
      variants={hoverCard}
      initial="rest"
      whileHover="hover"
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      // Hover also updates box-shadow for the glow
      style={{ boxShadow: 'none' }}
    >
      {/* Glow on hover — CSS transition so it doesn't interfere with FM spring */}
      <div className="absolute inset-0 rounded-2xl transition-shadow duration-300 pointer-events-none group-hover:shadow-[0_0_0_1px_rgba(0,229,255,0.12)]" />

      {/* Inner: entrance whileInView */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, delay, ease: EASE_OUT }}
        className="relative h-full"
      >
        {/* Ambient glow blob */}
        <div
          className={`absolute ${glowClass} w-64 h-64 rounded-full pointer-events-none`}
          style={{
            background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)',
            filter: 'blur(48px)',
          }}
        />

        {/* Ghost icon watermark — wide cards only */}
        {isWide && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none">
            <Icon
              style={{ width: 200, height: 200, opacity: 0.028, transform: 'translateX(20%)' }}
              className="text-white"
            />
          </div>
        )}

        {/* Card content */}
        <div className={`relative flex flex-col h-full ${isWide ? 'p-8 lg:p-10' : 'p-7'}`}>

          {/* Icon box */}
          <motion.div
            variants={hoverIcon}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={`flex-shrink-0 flex items-center justify-center rounded-xl border border-[#00E5FF]/[0.14] bg-[#00E5FF]/[0.07] mb-6 ${
              isWide ? 'w-12 h-12' : 'w-10 h-10'
            }`}
          >
            <Icon className={`text-[#00E5FF] ${isWide ? 'w-5 h-5' : 'w-[18px] h-[18px]'}`} />
          </motion.div>

          {/* Title */}
          <h3 className={`font-semibold tracking-tight text-white mb-3 leading-snug ${
            isWide ? 'text-[1.3rem] lg:text-[1.45rem]' : 'text-lg'
          }`}>
            {service.title}
          </h3>

          {/* Description */}
          <p className={`text-[#B3B3B3] leading-relaxed flex-1 ${
            isWide ? 'text-[0.9375rem] max-w-sm' : 'text-sm'
          }`}>
            {service.description}
          </p>

          {/* Business outcome */}
          <motion.div
            variants={hoverOutcome}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="mt-6 flex items-center gap-2.5"
          >
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00E5FF]/[0.1] border border-[#00E5FF]/[0.18] flex items-center justify-center">
              <ArrowRight className="w-2.5 h-2.5 text-[#00E5FF]" />
            </div>
            <span className={`text-white/60 font-medium leading-tight ${isWide ? 'text-sm' : 'text-xs'}`}>
              {outcome}
            </span>
          </motion.div>

        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Services({ services }: ServicesProps) {
  const sectionRef  = useRef<HTMLElement>(null)
  const labelRef    = useRef<HTMLSpanElement>(null)
  const titleRef    = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

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
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4 },
        )

        const lines = titleRef.current?.querySelectorAll<HTMLElement>('.svc-line > span')
        if (lines?.length) {
          tl.fromTo(
            lines,
            { yPercent: 108, opacity: 0 },
            { yPercent: 0, opacity: 1, stagger: 0.1, duration: 0.85 },
            '-=0.1',
          )
        }

        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, filter: 'blur(6px)', y: 8 },
          { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.55 },
          '-=0.4',
        )
      },
      { threshold: 0.15 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const active = services.filter(s => s.is_active).slice(0, 6)

  return (
    <section id="services" ref={sectionRef} className="py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="mb-16 lg:mb-20">
          <span
            ref={labelRef}
            className="section-label block mb-5"
            style={{ opacity: 0 }}
          >
            Services
          </span>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2
              ref={titleRef}
              className="text-[clamp(2rem,4.5vw,3.75rem)] font-semibold tracking-[-0.03em]"
            >
              <div className="svc-line overflow-hidden" style={{ lineHeight: 1.1 }}>
                <span className="block text-white">What I Build</span>
              </div>
              <div className="svc-line overflow-hidden" style={{ lineHeight: 1.1 }}>
                <span className="block accent-gradient-text">For Your Business</span>
              </div>
            </h2>

            <p
              ref={subtitleRef}
              className="text-[#B3B3B3] leading-relaxed max-w-xs lg:text-right"
              style={{ opacity: 0 }}
            >
              Every engagement starts with a clear problem
              and ends with a measurable outcome.
            </p>
          </div>
        </div>

        {/* ── Bento Grid ──
            Row 1: AI Agents (2) │ Workflow (1)
            Row 2: CRM (1)       │ Int Tools (2)
            Row 3: Dashboard (1) │ Lead Gen (2)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {active.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={i}
              delay={i * 0.065}
            />
          ))}
        </div>

        {/* ── CTA strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25, ease: EASE_OUT }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 rounded-2xl border border-white/[0.06] bg-[#111111]/60"
        >
          <p className="text-sm text-[#B3B3B3] text-center sm:text-left">
            Not sure which service fits your situation?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-[#00E5FF] transition-colors duration-200 group flex-shrink-0"
          >
            Book a free 30-minute scoping call
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
