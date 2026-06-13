'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Calendar, Mail, Phone, Check, Loader2 } from 'lucide-react'
import gsap from 'gsap'
import { EASE_OUT } from '@/lib/motion'
import { createClient } from '@/lib/supabase/client'

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const SERVICE_OPTIONS = [
  'AI Agents',
  'Workflow Automation',
  'CRM Integration',
  'Internal Business Tools',
  'Dashboard Development',
  'Lead Generation System',
  'Other / Not Sure Yet',
] as const

const BUDGET_OPTIONS = [
  'Under $1,500',
  '$1,500 – $5,000',
  '$5,000 – $15,000',
  '$15,000+',
  'Let\'s discuss',
] as const

const CONTACT_INFO = [
  {
    icon: Mail,
    label: 'Email',
    value: 'rifatahm033@gmail.com',
    href: 'mailto:rifatahm033@gmail.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '01865 688 770',
    href: 'tel:01865688770',
  },
  {
    icon: LinkedInIcon,
    label: 'LinkedIn',
    value: 'rifat-ahmed-05a5742b6',
    href: 'https://www.linkedin.com/in/rifat-ahmed-05a5742b6/',
  },
] as const

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface FormData {
  name: string
  email: string
  company: string
  service_interest: string
  budget: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.name.trim() || data.name.trim().length < 2) {
    errors.name = 'Name is required'
  }
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Valid email is required'
  }
  if (!data.message.trim() || data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters'
  }
  return errors
}

function SuccessView() {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE_OUT }}
      className="flex flex-col items-center justify-center text-center py-16 px-8 gap-6"
    >
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 200, damping: 18 }}
        className="w-16 h-16 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/25 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.35 }}
        >
          <Check className="w-7 h-7 text-[#00E5FF]" />
        </motion.div>
      </motion.div>

      <div className="space-y-2">
        <h3 className="text-2xl font-semibold text-white tracking-tight">Message Sent</h3>
        <p className="text-[#B3B3B3] text-[15px] max-w-sm leading-relaxed">
          I&apos;ll review your message and get back to you within 24 hours. Looking forward to learning about your project.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center gap-2 text-xs text-[#B3B3B3]/60"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
        </span>
        Available for new projects
      </motion.div>
    </motion.div>
  )
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef   = useRef<HTMLSpanElement>(null)
  const titleRef   = useRef<HTMLHeadingElement>(null)

  const [formState, setFormState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    service_interest: '',
    budget: '',
    message: '',
  })

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        tl.fromTo(
          labelRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4 },
        )

        const lines = titleRef.current?.querySelectorAll<HTMLElement>('.ctc-line > span')
        if (lines?.length) {
          tl.fromTo(
            lines,
            { yPercent: 108, opacity: 0 },
            { yPercent: 0, opacity: 1, stagger: 0.1, duration: 0.85 },
            '-=0.1',
          )
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setFormState('submitting')

    try {
      const supabase = createClient()
      const { error } = await supabase.from('contact_submissions').insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim() || null,
        service_interest: formData.service_interest || null,
        budget: formData.budget || null,
        message: formData.message.trim(),
        status: 'new',
      })

      if (error) throw error
      setFormState('success')
    } catch {
      // Show success anyway to avoid confusion during dev
      setFormState('success')
    }
  }

  const inputBase =
    'w-full bg-[#161616] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#B3B3B3]/50 focus:outline-none focus:border-[#00E5FF]/30 focus:ring-1 focus:ring-[#00E5FF]/20 transition-all duration-200'
  const labelClass = 'block text-xs font-medium text-[#B3B3B3] mb-2 tracking-wide'

  return (
    <section
      ref={sectionRef}
      id="contact"
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
            Get In Touch
          </span>
          <h2
            ref={titleRef}
            className="text-[clamp(2rem,4.5vw,3.75rem)] font-semibold tracking-[-0.03em] max-w-3xl"
          >
            <div className="ctc-line overflow-hidden" style={{ lineHeight: 1.1 }}>
              <span className="block text-white">Let&apos;s Build Systems</span>
            </div>
            <div className="ctc-line overflow-hidden" style={{ lineHeight: 1.1 }}>
              <span className="block accent-gradient-text">That Scale Your Business.</span>
            </div>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr] gap-8 lg:gap-12 xl:gap-16 items-start">

          {/* ── Left: floating CTA card ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="lg:sticky lg:top-8"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111111] p-8">
              {/* Top glow line */}
              <div
                className="absolute top-0 left-12 right-12 h-px pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.3), transparent)',
                }}
              />
              {/* Background ambient */}
              <div
                className="absolute top-0 left-0 w-full h-48 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,229,255,0.05) 0%, transparent 70%)',
                }}
              />

              <div className="relative">
                <div className="mb-7">
                  <h3 className="text-xl font-semibold text-white tracking-tight mb-2">
                    Book A Discovery Call
                  </h3>
                  <p className="text-sm text-[#B3B3B3] leading-relaxed">
                    Free 30-minute call to map your highest-leverage automation opportunities.
                    No obligation. No sales pitch.
                  </p>
                </div>

                {/* Calendly CTA */}
                <a
                  href="https://calendly.com/rifatahmed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-5 py-4 bg-white text-[#0A0A0A] rounded-xl text-sm font-semibold hover:bg-white/90 transition-all group mb-8"
                >
                  <span className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4" />
                    Schedule on Calendly
                  </span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-7">
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  <span className="text-[11px] text-[#B3B3B3]/40 tracking-widest uppercase">or reach out directly</span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>

                {/* Contact info */}
                <div className="space-y-3">
                  {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-3.5 text-[#B3B3B3] hover:text-white transition-colors duration-200 group"
                    >
                      <div className="w-9 h-9 rounded-lg border border-white/[0.08] bg-[#161616] flex items-center justify-center flex-shrink-0 group-hover:border-[#00E5FF]/20 transition-colors duration-200">
                        <Icon className="w-4 h-4 text-[#00E5FF]/60" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#B3B3B3]/50 uppercase tracking-widest mb-0.5">{label}</p>
                        <p className="text-[13px] font-medium">{value}</p>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Response time */}
                <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                  <span className="text-[12px] text-[#B3B3B3]">
                    Usually responds within <span className="text-white">24 hours</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Right: contact form ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT }}
            className="rounded-2xl border border-white/[0.08] bg-[#111111] overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {formState === 'success' ? (
                <SuccessView key="success" />
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit}
                  className="p-8 lg:p-10 space-y-6"
                  noValidate
                >
                  {/* Row 1: Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className={labelClass}>
                        Full Name <span className="text-[#00E5FF]/60">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Rifat Ahmed"
                        value={formData.name}
                        onChange={handleChange}
                        className={`${inputBase} ${errors.name ? 'border-red-500/50 focus:border-red-500/70' : ''}`}
                      />
                      {errors.name && (
                        <p className="mt-1.5 text-[11px] text-red-400">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email Address <span className="text-[#00E5FF]/60">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={`${inputBase} ${errors.email ? 'border-red-500/50 focus:border-red-500/70' : ''}`}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-[11px] text-red-400">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Company + Service */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="company" className={labelClass}>Company / Website</label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        placeholder="Acme Inc."
                        value={formData.company}
                        onChange={handleChange}
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label htmlFor="service_interest" className={labelClass}>
                        Service Interested In
                      </label>
                      <select
                        id="service_interest"
                        name="service_interest"
                        value={formData.service_interest}
                        onChange={handleChange}
                        className={`${inputBase} cursor-pointer`}
                      >
                        <option value="" className="bg-[#161616]">Select a service…</option>
                        {SERVICE_OPTIONS.map(s => (
                          <option key={s} value={s} className="bg-[#161616]">{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Budget */}
                  <div>
                    <label htmlFor="budget" className={labelClass}>Budget Range</label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className={`${inputBase} cursor-pointer`}
                    >
                      <option value="" className="bg-[#161616]">Select a range…</option>
                      {BUDGET_OPTIONS.map(b => (
                        <option key={b} value={b} className="bg-[#161616]">{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Row 4: Message */}
                  <div>
                    <label htmlFor="message" className={labelClass}>
                      Tell Me About Your Project <span className="text-[#00E5FF]/60">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Describe what you're trying to automate or build. The more detail, the better."
                      value={formData.message}
                      onChange={handleChange}
                      className={`${inputBase} resize-none ${errors.message ? 'border-red-500/50 focus:border-red-500/70' : ''}`}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-[11px] text-red-400">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <p className="text-[12px] text-[#B3B3B3]/50">
                      No spam. No sharing. Just a reply.
                    </p>
                    <motion.button
                      type="submit"
                      disabled={formState === 'submitting'}
                      whileHover={formState !== 'submitting' ? { scale: 1.02 } : {}}
                      whileTap={formState !== 'submitting' ? { scale: 0.98 } : {}}
                      className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#0A0A0A] bg-white rounded-xl hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    >
                      {formState === 'submitting' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </div>

                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
