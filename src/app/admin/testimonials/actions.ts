'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Testimonial } from '@/lib/types'

type TestimonialInput = Omit<Testimonial, 'id' | 'created_at'>

export async function createTestimonial(data: TestimonialInput) {
  const supabase = await createClient()
  const { error } = await supabase.from('testimonials').insert(data)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/testimonials')
  revalidatePath('/')
}

export async function updateTestimonial(id: string, data: Partial<TestimonialInput>) {
  const supabase = await createClient()
  const { error } = await supabase.from('testimonials').update(data).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/testimonials')
  revalidatePath('/')
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/testimonials')
  revalidatePath('/')
}

export async function deleteTestimonials(ids: string[]) {
  const supabase = await createClient()
  const { error } = await supabase.from('testimonials').delete().in('id', ids)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/testimonials')
}

export async function toggleTestimonialActive(id: string, is_active: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from('testimonials').update({ is_active }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/testimonials')
  revalidatePath('/')
}
