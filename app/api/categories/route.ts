import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getSiteWorkspace } from '@/lib/tenant'

// Categoriile workspace-ului rezolvat din domeniu (parametrul `workspace` din query nu mai e acceptat).
export async function GET() {
  const ws = await getSiteWorkspace()
  if (!ws) return NextResponse.json({ error: 'Site indisponibil' }, { status: 404 })
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, image_url, parent_id, sort_order')
    .eq('workspace_id', ws.id)
    .eq('is_active', true)
    .order('sort_order')
  if (error) {
    console.error('[api/categories GET]', error.message)
    return NextResponse.json({ error: 'Eroare la citire' }, { status: 500 })
  }
  return NextResponse.json({ categories: data, total: data?.length || 0 })
}
