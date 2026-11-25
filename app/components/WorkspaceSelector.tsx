'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface Workspace {
  id: string
  name: string
  slug: string
}

function getActiveCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/active_workspace=([^;]+)/)
  return match ? match[1] : null
}

function setActiveCookie(id: string) {
  document.cookie = `active_workspace=${id}; path=/; max-age=86400`
}

export default function WorkspaceSelector() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [activeId, setActiveId] = useState<string | null>(getActiveCookie)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('user_roles')
        .select('workspace_id, workspaces(id, name, slug)')
        .eq('user_id', user.id)
        .order('workspace_id')

      if (!data) return

      const list: Workspace[] = data
        .map((row) => (row as unknown as { workspaces: Workspace | null }).workspaces)
        .filter((w): w is Workspace => w !== null)

      setWorkspaces(list)

      const cookieId = getActiveCookie()
      if (!cookieId && list.length > 0) {
        setActiveCookie(list[0].id)
        setActiveId(list[0].id)
      }
    }

    load()
  }, [])

  function selectWorkspace(ws: Workspace) {
    setActiveCookie(ws.id)
    setActiveId(ws.id)
    setOpen(false)
    window.location.reload()
  }

  const activeName = workspaces.find(w => w.id === activeId)?.name ?? '...'

  return (
    <div className='relative mb-6'>
      <button
        onClick={() => setOpen(!open)}
        className='w-full flex items-center justify-between px-3 py-2 rounded text-sm'
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)'
        }}
      >
        <span className='truncate'>{activeName}</span>
        <span style={{ color: 'var(--accent)' }}>▾</span>
      </button>

      {open && (
        <div
          className='absolute top-full left-0 right-0 mt-1 rounded shadow-lg z-50'
          style={{ background: 'white', border: '1px solid var(--border)' }}
        >
          {workspaces.map((ws) => (
            <button
              key={ws.id}
              onClick={() => selectWorkspace(ws)}
              className='w-full text-left px-3 py-2 text-sm hover:opacity-80 transition-all'
              style={{
                background: activeId === ws.id ? 'var(--surface)' : 'white',
                color: activeId === ws.id ? 'var(--accent)' : 'var(--text-primary)',
                fontWeight: activeId === ws.id ? 600 : 400
              }}
            >
              {ws.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}