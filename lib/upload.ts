import { supabase } from './supabase'

export async function uploadFile(bucket: string, file: File) {
  const name = `${Date.now()}_${file.name}`
  const { error } = await supabase.storage.from(bucket).upload(name, file)
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(name)
  return data.publicUrl
}