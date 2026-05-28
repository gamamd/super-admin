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

  const workspace_id = WORKSPACE_MAP[workspace]
  if (!workspace_id) {
    return NextResponse.json({ error: 'Workspace invalid' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, image_url, parent_id, sort_order')
    .eq('workspace_id', workspace_id)
    .eq('is_active', true)
    .order('sort_order')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ categories: data, total: data?.length || 0 })
}