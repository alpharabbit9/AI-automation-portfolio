import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProjectForm from '../../ProjectForm'
import { updateProject } from '../../actions'
import type { Project } from '@/lib/types'

export const metadata: Metadata = { title: 'Edit Project' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
  if (error || !data) notFound()
  const project = data as Project
  return (
    <ProjectForm
      project={project}
      isEdit
      onSave={(formData) => updateProject(id, formData)}
    />
  )
}
