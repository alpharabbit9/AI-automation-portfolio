import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import FounderCard from '@/components/sections/FounderCard'
import Services from '@/components/sections/Services'
import AboutPreview from '@/components/sections/AboutPreview'
import CaseStudies from '@/components/sections/CaseStudies'
import Process from '@/components/sections/Process'
import About from '@/components/sections/About'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'
import { heroContent, services, caseStudies as staticStudies, testimonials } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'
import type { CaseStudy } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Rifat Ahmed — AI Automation Consultant',
  description: 'I build AI agents, n8n workflows, and automation systems that eliminate operational bottlenecks and drive measurable business outcomes.',
}

async function getCaseStudies(): Promise<CaseStudy[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
    if (!error && data && data.length > 0) return data as CaseStudy[]
  } catch {
    // Supabase not configured or tables don't exist yet — fall through
  }
  return staticStudies
}

export default async function HomePage() {
  const studies = await getCaseStudies()

  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero content={heroContent} />
        <FounderCard />
        <Services services={services} />
        <AboutPreview />
        <CaseStudies studies={studies} />
        <Process />
        <About />
        <Testimonials testimonials={testimonials} />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
