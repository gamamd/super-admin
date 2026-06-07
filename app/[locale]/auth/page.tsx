'use client'

import { useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthForm() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  async function handleSubmit() {
    setLoading(true)
    setError('')
    setSuccess('')

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('Email sau parolă incorectă.')
      } else {
  const redirect = searchParams.get('redirect') || '/'
  // Așteptăm să se salveze sesiunea
  await supabase.auth.getSession()
  window.location.replace(redirect)
}
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      })
      if (error) {
        setError('Eroare la înregistrare. Încearcă din nou.')
      } else {
        setSuccess('Cont creat! Verifică emailul pentru confirmare.')
      }
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--background)" }}>
      <div className="w-full max-w-md">
        <div className="flex mb-8" style={{ borderBottom: "1px solid var(--border)" }}>
          <button onClick={() => setMode('login')} className="px-6 py-3 text-sm font-medium transition-colors"
            style={{ color: mode === 'login' ? "var(--text-primary)" : "var(--text-secondary)", borderBottom: mode === 'login' ? "2px solid var(--text-primary)" : "2px solid transparent" }}>
            Autentificare
          </button>
          <button onClick={() => setMode('register')} className="px-6 py-3 text-sm font-medium transition-colors"
            style={{ color: mode === 'register' ? "var(--text-primary)" : "var(--text-secondary)", borderBottom: mode === 'register' ? "2px solid var(--text-primary)" : "2px solid transparent" }}>
            Cont nou
          </button>
        </div>

        <h1 className="text-3xl font-medium mb-8" style={{ color: "var(--text-primary)" }}>
          {mode === 'login' ? 'Bună revenire' : 'Creează cont'}
        </h1>

        <div className="flex flex-col gap-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>Nume complet</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 text-base outline-none"
                style={{ border: "1px solid var(--border)", background: "var(--background)", color: "var(--text-primary)" }}
                placeholder="Ion Popescu" />
            </div>
          )}

          <div>
            <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-base outline-none"
              style={{ border: "1px solid var(--border)", background: "var(--background)", color: "var(--text-primary)" }}
              placeholder="email@exemplu.com" />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>Parolă</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-base outline-none"
              style={{ border: "1px solid var(--border)", background: "var(--background)", color: "var(--text-primary)" }}
              placeholder="Minim 6 caractere" />
          </div>

          {error && <p className="text-sm" style={{ color: "#e53e3e" }}>{error}</p>}
          {success && <p className="text-sm" style={{ color: "#38a169" }}>{success}</p>}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-4 text-base font-medium transition-opacity hover:opacity-80 disabled:opacity-50 mt-2"
            style={{ background: "var(--text-primary)", color: "var(--background)" }}>
            {loading ? 'Se procesează...' : mode === 'login' ? 'Intră în cont' : 'Creează cont'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  )
}