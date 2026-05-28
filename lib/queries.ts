import { supabase } from './supabase'

const IPRINTSMART_WORKSPACE_ID = '94722422-b939-44d0-a580-7420eebbb554'

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, image_url')
    .eq('workspace_id', IPRINTSMART_WORKSPACE_ID)
    .eq('is_active', true)
    .order('sort_order')

  if (error) throw error
  return data
}

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, description, price, image_url, is_customizable, category_id')
    .eq('workspace_id', IPRINTSMART_WORKSPACE_ID)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}