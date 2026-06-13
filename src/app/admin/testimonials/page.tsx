import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import TestimonialsTable from './TestimonialsTable'
import type { Testimonial } from '@/lib/types'

export const metadata: Metadata = { title: 'Testimonials' }

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) throw error
    return (data as Testimonial[]) ?? []
  } catch {
    return []
  }
}

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Testimonials</h1>
          <p className="text-sm text-[#B3B3B3] mt-1">{testimonials.length} total</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#0A0A0A] bg-white rounded-xl hover:bg-white/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </Link>
      </div>

      <TestimonialsTable testimonials={testimonials} />
    </div>
  )
}
