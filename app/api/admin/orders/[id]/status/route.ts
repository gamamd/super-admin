import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getAdminContext, getCurrentUser } from '@/lib/tenant'

// Schimbarea statusului unei comenzi — doar pe server (înlocuiește update-ul anon din browser).
// Acces: utilizator logat cu rol (super_admin / admin / operator) în workspace-ul activ;
// comanda trebuie să aparțină acelui workspace.
const STATUSES = ['new', 'confirmed', 'in_productie', 'expediat', 'livrat', 'anulat'] as const
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await getAdminContext()
  if (!ctx) {
    const user = await getCurrentUser()
    return user
      ? NextResponse.json({ error: 'Fără drepturi' }, { status: 403 })
      : NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
  }
  // Doar JSON: un formular de pe alt site nu poate trimite application/json fără CORS.
  if (!(request.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) {
    return NextResponse.json({ error: 'Cerere invalidă' }, { status: 415 })
  }
  const { id } = await params
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Comandă inexistentă' }, { status: 404 })
  }
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cerere invalidă' }, { status: 400 })
  }
  const status = (body as { status?: unknown } | null)?.status
  if (typeof status !== 'string' || !(STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ error: 'Status invalid' }, { status: 400 })
  }
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('workspace_id', ctx.workspaceId)
    .select('id, status')
    .maybeSingle()
  if (error) {
    console.error('[orders/status]', error.message)
    return NextResponse.json({ error: 'Eroare la salvare' }, { status: 500 })
  }
  if (!data) return NextResponse.json({ error: 'Comandă inexistentă' }, { status: 404 })
  return NextResponse.json({ id: data.id, status: data.status })
}
