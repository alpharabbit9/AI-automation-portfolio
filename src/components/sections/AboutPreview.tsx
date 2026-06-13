'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { EASE_OUT, prefersReducedMotion } from '@/lib/motion'

export default function AboutPreview() {
  const sectionRef  = useRef<HTMLElement>(null)
  const labelRef    = useRef<HTMLSpanElement>(null)
  const titleRef    = useRef<HTMLHeadingElement>(null)
  const contentRef  = useRef<HTMLDivElement>(null)

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

        const lines = titleRef.current?.querySelectorAll<HTMLElement>('.abt-line > span')
        if (lines?.length) {
          tl.fromTo(
            lines,
            { yPercent: 108, opacity: 0 },
            { yPercent: 0, opacity: 1, stagger: 0.1, duration: 0.85 },
            '-=0.1',
          )
        }

        tl.fromTo(
          contentRef.current,
          { opacity: 0, y: 20, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7 },
          '-=0.4',
        )
      },
      { threshold: 0.15 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mb-14 lg:mb-16">
          <span
            ref={labelRef}
            className="section-label block mb-5"
            style={{ opacity: 0 }}
          >
            About the Founder
          </span>

          <h2
            ref={titleRef}
            className="text-[clamp(2rem,4.5vw,3.75rem)] font-semibold tracking-[-0.03em] max-w-3xl"
          >
            <div className="abt-line overflow-hidden" style={{ lineHeight: 1.1 }}>
              <span className="block text-white">Helping Businesses Replace</span>
            </div>
            <div className="abt-line overflow-hidden" style={{ lineHeight: 1.1 }}>
              <span className="block accent-gradient-text">Repetitive Work With AI.</span>
            </div>
          </h2>
        </div>

        {/* ── Content: portrait + story ── */}
        <div
          ref={contentRef}
          className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] gap-10 lg:gap-16"
          style={{ opacity: 0 }}
        >
          {/* Portrait thumbnail */}
          <div className="flex flex-col gap-4">
            <motion.div
              className="relative rounded-2xl overflow-hidden border border-white/[0.08]"
              whileHover={{
                scale: 1.015,
                boxShadow: '0 0 0 1px rgba(0,229,255,0.1), 0 20px 48px rgba(0,0,0,0.5)',
                transition: { type: 'spring', stiffness: 300, damping: 28 },
              }}
            >
              {/* Floating glow */}
              <div
                className="absolute pointer-events-none"
                style={{
                  inset: '-16px',
                  background:
                    'radial-gradient(ellipse at 50% 30%, rgba(0,229,255,0.06) 0%, transparent 65%)',
                  filter: 'blur(12px)',
                }}
              />

              <div className="relative w-full" style={{ aspectRatio: '4/5' }}>
                <Image
                  src="/rifat.png"
                  alt="Rifat Ahmed"
                  fill
                  sizes="(max-width: 1024px) 80vw, 320px"
                  className="object-cover"
                  style={{
                    objectPosition: 'center 8%',
                    filter: 'contrast(1.07) brightness(0.86) saturate(0.88)',
                  }}
                />
                {/* Bottom blend */}
                <div
                  className="absolute bottom-0 left-0 right-0 pointer-events-none"
                  style={{
                    height: '30%',
                    background:
                      'linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 100%)',
                  }}
                />
              </div>
            </motion.div>

            {/* Name badge below thumbnail */}
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-white">Rifat Ahmed</p>
              <p className="text-xs text-[#B3B3B3]">AI Automation Consultant</p>
            </div>
          </div>

          {/* Story text */}
          <div className="flex flex-col justify-center gap-6">
            <div className="space-y-5 text-[#B3B3B3] leading-relaxed">
              <p className="text-[15px] lg:text-base">
                I started consulting because I kept seeing businesses lose thousands of hours
                every year to work that machines could handle. Manual data entry, repetitive
                follow-ups, copy-paste between tools — every hour spent there is an hour not
                spent growing.
              </p>
              <p className="text-[15px] lg:text-base">
                Over{' '}
                <span className="text-white/80 font-medium">5+ years</span>, I&apos;ve built AI
                agents, n8n workflows, and custom internal tools for{' '}
                <span className="text-white/80 font-medium">15+ businesses</span> across SaaS,
                logistics, e-commerce, and professional services — saving them time, cutting
                costs, and letting their teams focus on what actually matters.
              </p>
              <p className="text-[15px] lg:text-base">
                Every system I build is practical, measurable, and designed to work without
                requiring a technical team to maintain it. I don&apos;t just deliver code — I
                deliver outcomes.
              </p>
            </div>

            {/* CTA */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 group w-fit"
            >
              Work with me
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
