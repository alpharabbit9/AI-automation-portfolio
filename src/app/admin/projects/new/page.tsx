import type { Metadata } from 'next'
import ProjectForm from '../ProjectForm'
import { createProject } from '../actions'

export const metadata: Metadata = { title: 'New Project' }

export default function NewProjectPage() {
  return <ProjectForm onSave={createProject} />
}
