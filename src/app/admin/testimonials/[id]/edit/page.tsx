import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TestimonialForm from '../../TestimonialForm'
import { updateTestimonial } from '../../actions'
import type { Testimonial } from '@/lib/types'

export const metadata: Metadata = { title: 'Edit Testimonial' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditTestimonialPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase.from('testimonials').select('*').eq('id', id).single()
  if (error || !data) notFound()
  const testimonial = data as Testimonial
  return (
    <TestimonialForm
      testimonial={testimonial}
      isEdit
      onSave={(formData) => updateTestimonial(id, formData)}
    />
  )
}
