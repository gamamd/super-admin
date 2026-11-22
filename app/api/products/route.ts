import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getAdminContext, getCurrentUser, getSiteWorkspace } from '@/lib/tenant'

// GET: produsele workspace-ului rezolvat din domeniu (parametrul `workspace` din query nu mai e acceptat).
export async function GET(request: NextRequest) {
  const ws = await getSiteWorkspace()
  if (!ws) return NextResponse.json({ error: 'Site indisponibil' }, { status: 404 })
  const { searchParams } = new URL(request.url)
  const category_id = searchParams.get('category_id')
  const raw = parseInt(searchParams.get('limit') || '20', 10)
  const limit = Number.isFinite(raw) ? Math.min(Math.max(raw, 1), 100) : 20
  let query = supabase
    .from('products')
    .select('id, name, slug, description, price, image_url, is_customizable, category_id')
    .eq('workspace_id', ws.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (category_id) query = query.eq('category_id', category_id)
  const { data, error } = await query
  if (error) {
    console.error('[api/products GET]', error.message)
    return NextResponse.json({ error: 'Eroare la citire' }, { status: 500 })
  }
  return NextResponse.json({ products: data, total: data?.length || 0 })
}

// POST: doar utilizator logat, cu rol admin / super_admin în workspace-ul activ din admin.
// workspace_id din corpul cererii e ignorat — se folosește doar cel verificat pe server.
export async function POST(request: NextRequest) {
  const ctx = await getAdminContext()
  if (!ctx) {
    const user = await getCurrentUser()
    return user
      ? NextResponse.json({ error: 'Fără drepturi' }, { status: 403 })
      : NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
  }
  if (ctx.role !== 'admin' && ctx.role !== 'super_admin') {
    return NextResponse.json({ error: 'Fără drepturi' }, { status: 403 })
  }
  let body: Record<string, unknown> | null
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cerere invalidă' }, { status: 400 })
  }
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const slug = typeof body?.slug === 'string' ? body.slug.trim().toLowerCase() : ''
  const description = typeof body?.description === 'string' && body.description.trim() ? body.description.trim() : null
  const p = body?.price
  const price =
    p === undefined || p === null || p === '' ? null
    : typeof p === 'number' ? p
    : typeof p === 'string' && /^\d+(\.\d{1,2})?$/.test(p.trim()) ? Number(p.trim())
    : NaN
  if (!name || name.length > 200 || !/^[a-z0-9-]{1,120}$/.test(slug)) {
    return NextResponse.json({ error: 'Lipsesc câmpuri obligatorii sau sunt invalide' }, { status: 400 })
  }
  if (price !== null && (!Number.isFinite(price) || price < 0)) {
    return NextResponse.json({ error: 'Preț invalid' }, { status: 400 })
  }
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert({ name, slug, price, description, workspace_id: ctx.workspaceId, is_active: true })
    .select()
    .single()
  if (error) {
    console.error('[api/products POST]', error.message)
    return NextResponse.json({ error: 'Eroare la salvare' }, { status: 500 })
  }
  return NextResponse.json({ product: data }, { status: 201 })
}
