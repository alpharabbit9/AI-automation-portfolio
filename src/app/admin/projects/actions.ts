'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Project } from '@/lib/types'

export async function createProject(data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').insert({
    ...data,
    updated_at: new Date().toISOString(),
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/projects')
  revalidatePath('/')
}

export async function updateProject(id: string, data: Partial<Omit<Project, 'id' | 'created_at'>>) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('projects')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/projects')
  revalidatePath('/')
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/projects')
  revalidatePath('/')
}

export async function deleteProjects(ids: string[]) {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').delete().in('id', ids)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/projects')
}
