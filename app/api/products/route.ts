import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const WORKSPACE_MAP: Record<string, string> = {
  'i-printsmart': '94722422-b939-44d0-a580-7420eebbb554',
  'gama': '8a8cae41-1f78-45fa-9485-011722a4a9aa',
  'landing3': '1ed9b3b5-abc4-46f0-b0e3-e379335e26b3',
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const workspace = searchParams.get('workspace') || 'i-printsmart'
  const category_id = searchParams.get('category_id')
  const limit = parseInt(searchParams.get('limit') || '20')

  const workspace_id = WORKSPACE_MAP[workspace]
  if (!workspace_id) {
    return NextResponse.json({ error: 'Workspace invalid' }, { status: 400 })
  }

  let query = supabase
    .from('products')
    .select('id, name, slug, description, price, image_url, is_customizable, category_id')
    .eq('workspace_id', workspace_id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (category_id) {
    query = query.eq('category_id', category_id)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ products: data, total: data?.length || 0 })
}