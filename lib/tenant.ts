// Rezolvarea workspace-ului (multi-tenant) — DOAR SERVER.
// Nu importa acest fișier în componente 'use client' (folosește cheia secretă prin supabase-admin).
//
// Site public: domeniul cererii (header `host`) → tabelul `workspace_domains` → workspace.
// Domeniu necunoscut → null (pagina arată „site indisponibil”, niciodată datele altui workspace).
// Pe preview Vercel / dezvoltare locală: cookie-ul `preview_ws` (slug) alege workspace-ul de test;
// în producție cookie-ul e ignorat.
// Admin: workspace-ul din cookie-ul `active_workspace`, acceptat DOAR dacă utilizatorul are rol în el.

import { cookies, headers } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { supabaseAdmin } from '@/lib/supabase-admin'

export type Workspace = {
  id: string
  name: string
  slug: string
  theme: Record<string, unknown>
}

export type AdminRole = 'super_admin' | 'admin' | 'operator'

export const PREVIEW_COOKIE = 'preview_ws'

/** Previzualizarea pe alt workspace e permisă doar pe preview Vercel și local. */
export function previewOverrideAllowed(): boolean {
  if (process.env.VERCEL_ENV === 'production') return false
  return process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development'
}

/** host → formă canonică: litere mici, fără port, fără punct final, fără `www.`. */
export function normalizeHost(raw: string | null | undefined): string | null {
  if (!raw) return null
  let h = raw.trim().toLowerCase()
  if (!h || h.length > 253) return null
  // IPv6 între paranteze: nu e un domeniu de site
  if (h.startsWith('[')) return null
  h = h.replace(/:\d+$/, '').replace(/\.$/, '')
  if (h.startsWith('www.')) h = h.slice(4)
  if (!/^[a-z0-9.-]+$/.test(h) || h.includes('..')) return null
  return h
}

const SLUG_RE = /^[a-z0-9-]{1,64}$/

// Cache în memorie, per instanță de server. TTL scurt: o schimbare în DB apare în ~1 min.
const TTL_MS = 60_000
const hostCache = new Map<string, { ws: Workspace | null; t: number }>()
const slugCache = new Map<string, { ws: Workspace | null; t: number }>()

function fresh<T extends { t: number }>(e: T | undefined): e is T {
  return !!e && Date.now() - e.t < TTL_MS
}

type Row = { id?: unknown; name?: unknown; slug?: unknown; theme?: unknown }
const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)

function toWorkspace(raw: unknown): Workspace | null {
  // un join Supabase poate întoarce obiect sau listă
  const row = (Array.isArray(raw) ? raw[0] : raw) as Row | null | undefined
  if (!row || !row.id) return null
  const theme = isObj(row.theme) ? row.theme : {}
  return { id: String(row.id), name: String(row.name ?? ''), slug: String(row.slug ?? ''), theme }
}

export async function workspaceByHost(host: string | null): Promise<Workspace | null> {
  const h = normalizeHost(host)
  if (!h) return null
  const c = hostCache.get(h)
  if (fresh(c)) return c.ws
  const { data, error } = await supabaseAdmin
    .from('workspace_domains')
    .select('workspaces(id, name, slug, theme)')
    .eq('host', h)
    .eq('is_active', true)
    .maybeSingle()
  if (error) {
    // Eroare DB (ex. Supabase în pauză): nu se pune în cache, nu se ghicește un workspace.
    console.error('[tenant] workspaceByHost', h, error.message)
    return null
  }
  const ws = toWorkspace((data as { workspaces?: unknown } | null)?.workspaces)
  hostCache.set(h, { ws, t: Date.now() })
  return ws
}

export async function workspaceBySlug(slug: string | null | undefined): Promise<Workspace | null> {
  const s = (slug ?? '').trim().toLowerCase()
  if (!SLUG_RE.test(s)) return null
  const c = slugCache.get(s)
  if (fresh(c)) return c.ws
  const { data, error } = await supabaseAdmin
    .from('workspaces')
    .select('id, name, slug, theme')
    .eq('slug', s)
    .maybeSingle()
  if (error) {
    console.error('[tenant] workspaceBySlug', s, error.message)
    return null
  }
  const ws = toWorkspace(data)
  slugCache.set(s, { ws, t: Date.now() })
  return ws
}

/** Workspace-ul site-ului public pentru cererea curentă (null = domeniu necunoscut). */
export async function getSiteWorkspace(): Promise<Workspace | null> {
  if (previewOverrideAllowed()) {
    const slug = (await cookies()).get(PREVIEW_COOKIE)?.value
    if (slug) {
      const ws = await workspaceBySlug(slug)
      if (ws) return ws
    }
  }
  const h = await headers()
  return workspaceByHost(h.get('host'))
}

/** Utilizatorul logat (verificat la Supabase Auth, nu doar citit din cookie). */
export async function getCurrentUser() {
  const store = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return store.getAll()
        },
        setAll() {
          // citire doar: proxy.ts (getUser) reîmprospătează sesiunea și scrie cookie-urile;
          // pentru /api (exclus din proxy) sesiunea din cookie trebuie să fie încă validă
        },
      },
    }
  )
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null
  return data.user
}

export type AdminContext = {
  userId: string
  workspaceId: string
  role: AdminRole
  allowed: { workspaceId: string; role: AdminRole }[]
}

/**
 * Workspace-ul activ în admin: cookie `active_workspace` DOAR dacă utilizatorul are rol în el;
 * altfel primul workspace în care are rol; fără niciun rol → null (fără acces la date).
 */
export async function getAdminContext(): Promise<AdminContext | null> {
  const user = await getCurrentUser()
  if (!user) return null
  const { data, error } = await supabaseAdmin
    .from('user_roles')
    .select('workspace_id, role')
    .eq('user_id', user.id)
    .order('workspace_id')
  if (error) {
    console.error('[tenant] user_roles', error.message)
    return null
  }
  const ROLES: AdminRole[] = ['super_admin', 'admin', 'operator']
  const allowed = ((data ?? []) as { workspace_id: unknown; role: unknown }[])
    .filter(r => !!r.workspace_id && ROLES.includes(r.role as AdminRole))
    .map(r => ({ workspaceId: String(r.workspace_id), role: r.role as AdminRole }))
  if (!allowed.length) return null
  const wanted = (await cookies()).get('active_workspace')?.value
  const pick = allowed.find(a => a.workspaceId === wanted) ?? allowed[0]
  return { userId: user.id, workspaceId: pick.workspaceId, role: pick.role, allowed }
}

/** Culorile temei: doar chei cunoscute și valori de culoare valide (fără injecție CSS). */
const THEME_KEYS = ['background', 'surface', 'text-primary', 'text-secondary', 'accent', 'border', 'foreground'] as const
const COLOR_RE = /^(#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.\s,%]+\)|hsla?\(\s*[\d.\s,%deg]+\))$/

export function themeCss(ws: Workspace | null): string {
  const colors = ws?.theme?.colors
  if (!isObj(colors)) return ''
  const lines: string[] = []
  for (const k of THEME_KEYS) {
    const v = colors[k]
    if (typeof v === 'string' && COLOR_RE.test(v.trim())) lines.push(`--${k}:${v.trim()};`)
  }
  return lines.length ? `:root{${lines.join('')}}` : ''
}

export function brandName(ws: Workspace | null): string {
  const b = ws?.theme?.brand
  if (typeof b === 'string' && b.trim()) return b.trim().slice(0, 60)
  return ws?.name || ''
}
