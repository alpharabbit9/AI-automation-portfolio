'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { CaseStudy } from '@/lib/types'

type CaseStudyInput = Omit<CaseStudy, 'id' | 'created_at' | 'updated_at'>

export async function createCaseStudy(data: CaseStudyInput) {
  const supabase = await createClient()
  const { error } = await supabase.from('case_studies').insert({
    ...data,
    updated_at: new Date().toISOString(),
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/case-studies')
  revalidatePath('/')
}

export async function updateCaseStudy(id: string, data: Partial<CaseStudyInput>) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('case_studies')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/case-studies')
  revalidatePath('/')
}

export async function deleteCaseStudy(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('case_studies').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/case-studies')
  revalidatePath('/')
}

export async function deleteCaseStudies(ids: string[]) {
  const supabase = await createClient()
  const { error } = await supabase.from('case_studies').delete().in('id', ids)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/case-studies')
}

export async function toggleCaseStudyPublished(id: string, is_published: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('case_studies')
    .update({ is_published, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/case-studies')
  revalidatePath('/')
}
