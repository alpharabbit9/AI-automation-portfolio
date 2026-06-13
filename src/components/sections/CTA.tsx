'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, MessageSquare } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-24 lg:py-32 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl border border-white/[0.08] bg-[#111111] overflow-hidden"
        >
          {/* Background accent */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00E5FF]/[0.04] rounded-full blur-3xl" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/20 to-transparent" />
          </div>

          <div className="relative px-8 lg:px-16 py-16 lg:py-20">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-label mb-6 block">Get Started</span>
              <h2 className="text-4xl lg:text-6xl font-semibold tracking-tight text-white mb-6">
                Ready to Automate<br />
                <span className="accent-gradient-text">What&apos;s Slowing You Down?</span>
              </h2>
              <p className="text-lg text-[#B3B3B3] leading-relaxed mb-10 max-w-xl mx-auto">
                Book a free 30-minute discovery call. We&apos;ll identify your highest-leverage automation opportunities and map a clear path to ROI.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-4 text-base font-semibold text-[#0A0A0A] bg-white rounded-xl hover:bg-white/90 transition-all group"
                >
                  <Calendar className="w-4 h-4" />
                  Book a Discovery Call
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="mailto:hello@rifatahmed.dev"
                  className="inline-flex items-center gap-2 px-7 py-4 text-base font-medium text-white border border-white/[0.12] rounded-xl hover:bg-white/[0.04] hover:border-white/20 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  Send a Message
                </a>
              </div>

              <p className="mt-8 text-sm text-[#B3B3B3]">
                No obligation. No sales pitch. Just a conversation about your operations.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
