import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { siteConfig } from '@/lib/data'

type FooterLink = { label: string; href: string; external?: boolean }

const footerLinks: Record<string, FooterLink[]> = {
  Services: [
    { label: 'AI Agents',         href: '/#services' },
    { label: 'n8n Automation',    href: '/#services' },
    { label: 'CRM Integration',   href: '/#services' },
    { label: 'Internal Tools',    href: '/#services' },
    { label: 'Dashboards',        href: '/#services' },
  ],
  Work: [
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Process',      href: '/#process' },
    { label: 'About',        href: '/#about' },
  ],
  Connect: [
    { label: 'Book a Call',  href: '/contact' },
    { label: 'Email',        href: `mailto:${siteConfig.email}` },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/rifat-ahmed-05a5742b6/',
      external: true,
    },
    {
      label: 'Twitter / X',
      href: 'https://twitter.com/RifatAhmed033',
      external: true,
    },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 w-fit" aria-label="Rifat Ahmed — Home">
              <div className="w-7 h-7 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center" aria-hidden="true">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#00E5FF]" />
              </div>
              <span className="font-semibold text-sm text-white">Rifat Ahmed</span>
            </Link>
            <p className="text-sm text-[#B3B3B3] leading-relaxed max-w-xs">
              AI automation consultant building intelligent systems that help businesses scale without adding headcount.
            </p>
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <span className="text-xs text-[#B3B3B3]">Available for new projects</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-[#B3B3B3]">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      aria-label={link.external ? `${link.label} (opens in new tab)` : undefined}
                      className="flex items-center gap-1 text-sm text-[#B3B3B3] hover:text-white transition-colors duration-200 group"
                    >
                      {link.label}
                      {link.external && (
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#B3B3B3]">
            © {new Date().getFullYear()} Rifat Ahmed. All rights reserved.
          </p>
          <p className="text-xs text-[#555]">
            Built with Next.js · Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  )
}
