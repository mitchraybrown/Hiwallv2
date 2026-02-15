import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function uploadWallImage(file, wallId) {
  const ext = file.name.split('.').pop()
  const name = `${wallId}/${Date.now()}.${ext}`
  const { data, error } = await supabase.storage
    .from('wall-images')
    .upload(name, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  const { data: { publicUrl } } = supabase.storage
    .from('wall-images')
    .getPublicUrl(name)
  return { path: name, url: publicUrl }
}
