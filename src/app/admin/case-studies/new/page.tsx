import type { Metadata } from 'next'
import CaseStudyForm from '../CaseStudyForm'
import { createCaseStudy } from '../actions'

export const metadata: Metadata = { title: 'New Case Study' }

export default function NewCaseStudyPage() {
  return <CaseStudyForm onSave={createCaseStudy} />
}
