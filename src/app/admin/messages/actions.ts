'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type MessageStatus = 'new' | 'read' | 'replied' | 'archived'

export async function updateMessageStatus(id: string, status: MessageStatus) {
  const supabase = await createClient()
  const { error } = await supabase.from('contact_submissions').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/messages')
  revalidatePath('/admin')
}

export async function deleteMessage(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('contact_submissions').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/messages')
  revalidatePath('/admin')
}

export async function deleteMessages(ids: string[]) {
  const supabase = await createClient()
  const { error } = await supabase.from('contact_submissions').delete().in('id', ids)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/messages')
  revalidatePath('/admin')
}
