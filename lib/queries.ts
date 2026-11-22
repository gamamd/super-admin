import { supabase } from './supabase'

// workspaceId vine întotdeauna de la lib/tenant.ts (domeniu), niciodată hardcodat.

export async function getCategories(workspaceId: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, image_url')
    .eq('workspace_id', workspaceId)
    .eq('is_active', true)
    .order('sort_order')

  if (error) throw error
  return data
}

export async function getProducts(workspaceId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, description, price, image_url, is_customizable, category_id')
    .eq('workspace_id', workspaceId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
