import type { Metadata } from 'next'
import TestimonialForm from '../TestimonialForm'
import { createTestimonial } from '../actions'

export const metadata: Metadata = { title: 'New Testimonial' }

export default function NewTestimonialPage() {
  return <TestimonialForm onSave={createTestimonial} />
}
