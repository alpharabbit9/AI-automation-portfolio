import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, FolderOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import ProjectsTable from './ProjectsTable'
import type { Project } from '@/lib/types'

export const metadata: Metadata = { title: 'Projects' }

async function getProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
    if (!error && data) return data as Project[]
  } catch { /* table may not exist */ }
  return []
}

export default async function AdminProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Projects</h1>
          <p className="text-sm text-[#B3B3B3] mt-1">{projects.length} projects in portfolio</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#0A0A0A] bg-white rounded-xl hover:bg-white/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>
      <ProjectsTable projects={projects} />
    </div>
  )
}
