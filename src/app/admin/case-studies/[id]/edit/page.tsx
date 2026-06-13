import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CaseStudyForm from '../../CaseStudyForm'
import { updateCaseStudy } from '../../actions'
import type { CaseStudy } from '@/lib/types'

export const metadata: Metadata = { title: 'Edit Case Study' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditCaseStudyPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase.from('case_studies').select('*').eq('id', id).single()
  if (error || !data) notFound()
  const study = data as CaseStudy
  return (
    <CaseStudyForm
      caseStudy={study}
      isEdit
      onSave={(formData) => updateCaseStudy(id, formData)}
    />
  )
}
