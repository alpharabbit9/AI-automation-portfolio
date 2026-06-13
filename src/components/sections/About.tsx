'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Mail, Phone } from 'lucide-react'
import gsap from 'gsap'
import { EASE_OUT, prefersReducedMotion } from '@/lib/motion'

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.749-8.878L1.254 2.25H8.08l4.265 5.644L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  )
}

const TECH_STACK = [
  { name: 'Next.js',    color: '#ffffff',  bg: 'rgba(255,255,255,0.06)' },
  { name: 'TypeScript', color: '#3B82F6',  bg: 'rgba(59,130,246,0.08)'  },
  { name: 'Supabase',   color: '#3ECF8E',  bg: 'rgba(62,207,142,0.08)'  },
  { name: 'n8n',        color: '#EA4B71',  bg: 'rgba(234,75,113,0.08)'  },
  { name: 'OpenAI',     color: '#d4d4d4',  bg: 'rgba(212,212,212,0.06)' },
  { name: 'Claude',     color: '#CC9B7A',  bg: 'rgba(204,155,122,0.08)' },
  { name: 'LangChain',  color: '#5B8AF5',  bg: 'rgba(91,138,245,0.08)'  },
  { name: 'PostgreSQL', color: '#4F9CF9',  bg: 'rgba(79,156,249,0.08)'  },
  { name: 'Docker',     color: '#2496ED',  bg: 'rgba(36,150,237,0.08)'  },
] as const

const SOCIAL_LINKS = [
  {
    icon: LinkedInIcon,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/rifat-ahmed-05a5742b6/',
    text: 'rifat-ahmed-05a5742b6',
  },
  {
    icon: XIcon,
    label: 'Twitter / X',
    href: 'https://twitter.com/RifatAhmed033',
    text: '@RifatAhmed033',
  },
  {
    icon: Mail,
    label: 'Email',
    href: 'mailto:rifatahm033@gmail.com',
    text: 'rifatahm033@gmail.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    href: 'tel:01865688770',
    text: '01865 688 770',
  },
] as const

const CREDIBILITY = [
  { value: '5+',  label: 'Years Building' },
  { value: '25+', label: 'Automations' },
  { value: '15+', label: 'Businesses Helped' },
] as const

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef   = useRef<HTMLSpanElement>(null)
  const titleRef   = useRef<HTMLHeadingElement>(null)
  const leftRef    = useRef<HTMLDivElement>(null)
  const rightRef   = useRef<HTMLDivElement>(null)

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

        const lines = titleRef.current?.querySelectorAll<HTMLElement>('.abt2-line > span')
        if (lines?.length) {
          tl.fromTo(
            lines,
            { yPercent: 108, opacity: 0 },
            { yPercent: 0, opacity: 1, stagger: 0.1, duration: 0.85 },
            '-=0.1',
          )
        }

        tl.fromTo(
          leftRef.current,
          { opacity: 0, x: -24 },
          { opacity: 1, x: 0, duration: 0.7 },
          '-=0.5',
        )
        tl.fromTo(
          rightRef.current,
          { opacity: 0, x: 24, filter: 'blur(8px)' },
          { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.75 },
          '-=0.55',
        )
      },
      { threshold: 0.1 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-heading"
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
            About
          </span>
          <h2
            id="about-heading"
            ref={titleRef}
            className="text-[clamp(2rem,4.5vw,3.75rem)] font-semibold tracking-[-0.03em] max-w-2xl"
          >
            <div className="abt2-line overflow-hidden" style={{ lineHeight: 1.1 }}>
              <span className="block text-white">The Person Behind</span>
            </div>
            <div className="abt2-line overflow-hidden" style={{ lineHeight: 1.1 }}>
              <span className="block accent-gradient-text">the Systems.</span>
            </div>
          </h2>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr] gap-12 lg:gap-16">

          {/* ── Left: portrait + social ── */}
          <div
            ref={leftRef}
            className="flex flex-col gap-6"
            style={{ opacity: 0 }}
          >
            {/* Portrait */}
            <motion.div
              className="relative rounded-2xl overflow-hidden border border-white/[0.08]"
              whileHover={{
                scale: 1.015,
                boxShadow: '0 0 0 1px rgba(0,229,255,0.1), 0 20px 48px rgba(0,0,0,0.5)',
                transition: { type: 'spring', stiffness: 300, damping: 28 },
              }}
            >
              <div className="relative w-full" style={{ aspectRatio: '4/5' }}>
                <Image
                  src="/rifat.png"
                  alt="Rifat Ahmed, AI Automation Consultant"
                  fill
                  sizes="(max-width: 1024px) 80vw, 340px"
                  className="object-cover"
                  style={{
                    objectPosition: 'center 8%',
                    filter: 'contrast(1.07) brightness(0.86) saturate(0.88)',
                  }}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 pointer-events-none"
                  style={{
                    height: '35%',
                    background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 100%)',
                  }}
                  aria-hidden="true"
                />
                <div className="absolute bottom-0 left-0 right-0 p-5 pb-6">
                  <p className="text-[15px] font-semibold text-white">Rifat Ahmed</p>
                  <p className="text-xs text-[#B3B3B3] mt-0.5">AI Automation Consultant</p>
                </div>
              </div>
            </motion.div>

            {/* Social links */}
            <nav aria-label="Social links" className="space-y-2">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href, text }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={href.startsWith('http') ? `${label}: ${text} (opens in new tab)` : `${label}: ${text}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.06] bg-[#111111] text-[#B3B3B3] hover:text-white hover:border-white/[0.12] transition-all duration-200 group"
                  whileHover={{ x: 2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0 text-[#00E5FF]/60 group-hover:text-[#00E5FF] transition-colors duration-200" />
                  <span className="text-[13px] font-medium truncate">{text}</span>
                </motion.a>
              ))}
            </nav>
          </div>

          {/* ── Right: story + credibility ── */}
          <div
            ref={rightRef}
            className="flex flex-col justify-center gap-8"
            style={{ opacity: 0 }}
          >
            {/* Story */}
            <div className="space-y-5 text-[#B3B3B3] leading-relaxed">
              <p className="text-[15px] lg:text-base">
                I got into AI automation because I kept watching businesses bleed time.
                Not from bad decisions or lazy teams — but from work that{' '}
                <span className="text-white/80 font-medium">machines should be doing</span>.
                Data entry. Follow-up emails. Report assembly. Copy-paste between tools.
                Every hour spent on that is an hour not spent on what actually grows the business.
              </p>
              <p className="text-[15px] lg:text-base">
                Over the past{' '}
                <span className="text-white/80 font-medium">5+ years</span>, I&apos;ve built
                AI agents, n8n automation workflows, CRM integrations, and custom internal
                tools for{' '}
                <span className="text-white/80 font-medium">15+ businesses</span> across
                SaaS, logistics, e-commerce, and professional services. The systems I build
                are practical, measurable, and designed to run without a technical team
                maintaining them.
              </p>
              <p className="text-[15px] lg:text-base">
                I don&apos;t approach this as a developer shipping features. I approach it
                as someone who cares deeply about{' '}
                <span className="text-white/80 font-medium">the outcome on the other side</span>
                {' '}— the hours reclaimed, the costs cut, the growth that becomes possible when
                the operational drag is gone.
              </p>
            </div>

            {/* Credibility stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/[0.06]" aria-label="Credibility statistics">
              {CREDIBILITY.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08, ease: EASE_OUT }}
                  className="space-y-1"
                >
                  <div className="text-2xl lg:text-3xl font-semibold tracking-tight text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#B3B3B3] leading-tight">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tech stack ── */}
        <div className="mt-20 pt-12 border-t border-white/[0.06]">
          <span className="section-label block mb-8" aria-label="Tools and Technologies">Tools &amp; Technologies</span>

          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3" role="list" aria-label="Technology stack">
            {TECH_STACK.map((tech, i) => (
              <motion.div
                key={tech.name}
                role="listitem"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: EASE_OUT }}
                whileHover={{
                  y: -4,
                  transition: { type: 'spring', stiffness: 400, damping: 25 },
                }}
                className="rounded-xl border border-white/[0.07] px-3 py-4 flex flex-col items-center gap-2 cursor-default"
                style={{
                  borderColor: tech.bg,
                  background: tech.bg,
                }}
                title={tech.name}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: tech.color }}
                  aria-hidden="true"
                />
                <span
                  className="text-[11px] font-semibold text-center leading-tight"
                  style={{ color: tech.color }}
                >
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
