'use client'

import { useState } from 'react'
import { Loader2, CheckCircle2, Send } from 'lucide-react'

const serviceOptions = [
  'AI Agents',
  'n8n Workflow Automation',
  'CRM Integration',
  'Internal Business Tools',
  'Dashboard Development',
  'Lead Generation System',
  'Other / Not Sure',
]

const budgetOptions = [
  'Under $2,000',
  '$2,000 – $5,000',
  '$5,000 – $10,000',
  '$10,000 – $25,000',
  '$25,000+',
]

type State = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [state, setState] = useState<State>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service_interest: '',
    budget: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setState('success')
      } else {
        setState('error')
      }
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
          <CheckCircle2 className="w-7 h-7 text-emerald-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Message Sent</h3>
        <p className="text-[#B3B3B3] max-w-xs">
          Thank you for reaching out. I&apos;ll respond within 24 hours to set up a call.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#B3B3B3]">Name *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-[#B3B3B3]/50 focus:outline-none focus:border-[#00E5FF]/30 focus:bg-white/[0.06] transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#B3B3B3]">Email *</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="work@company.com"
            className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-[#B3B3B3]/50 focus:outline-none focus:border-[#00E5FF]/30 focus:bg-white/[0.06] transition-all"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-[#B3B3B3]">Company</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Your company name"
          className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-[#B3B3B3]/50 focus:outline-none focus:border-[#00E5FF]/30 focus:bg-white/[0.06] transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#B3B3B3]">Service Interest</label>
          <select
            name="service_interest"
            value={formData.service_interest}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-[#00E5FF]/30 focus:bg-white/[0.06] transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-[#161616]">Select a service</option>
            {serviceOptions.map(opt => (
              <option key={opt} value={opt} className="bg-[#161616]">{opt}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#B3B3B3]">Budget Range</label>
          <select
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-[#00E5FF]/30 focus:bg-white/[0.06] transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-[#161616]">Select a range</option>
            {budgetOptions.map(opt => (
              <option key={opt} value={opt} className="bg-[#161616]">{opt}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-[#B3B3B3]">Message *</label>
        <textarea
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          rows={5}
          placeholder="Tell me about your business, what's slowing you down, and what outcomes you're looking for..."
          className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-[#B3B3B3]/50 focus:outline-none focus:border-[#00E5FF]/30 focus:bg-white/[0.06] transition-all resize-none"
        />
      </div>

      {state === 'error' && (
        <p className="text-sm text-red-400">Something went wrong. Please try again or email directly.</p>
      )}

      <button
        type="submit"
        disabled={state === 'loading'}
        className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-[#0A0A0A] bg-white rounded-xl hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {state === 'loading' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  )
}
