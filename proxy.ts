import createMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const intlMiddleware = createMiddleware({
  locales: ['ro', 'ru', 'en'],
  defaultLocale: 'ro'
})

export async function proxy(req: NextRequest) {
  // Un singur răspuns (cel de i18n); cookie-urile de sesiune reîmprospătate de Supabase se scriu pe el,
  // ca refresh token-ul rotit să nu se piardă (delogări aleatorii).
  const res = intlMiddleware(req)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value)
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // getUser verifică sesiunea la Supabase și o reîmprospătează dacă e cazul.
  const { data: { user } } = await supabase.auth.getUser()

  const isAdminRoute = req.nextUrl.pathname.match(/\/(ro|ru|en)\/admin/)
  if (isAdminRoute && !user) {
    const loginUrl = new URL('/ro/auth', req.url)
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname)
    const redirect = NextResponse.redirect(loginUrl)
    res.cookies.getAll().forEach(c => redirect.cookies.set(c))
    return redirect
  }

  // Preview Vercel / local: `?ws=<slug>` alege workspace-ul de test (cookie `preview_ws`); `?ws=off` îl șterge.
  // În producție parametrul e ignorat — workspace-ul vine doar din domeniu (lib/tenant.ts).
  const previewAllowed = process.env.VERCEL_ENV !== 'production' &&
    (process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development')
  const ws = req.nextUrl.searchParams.get('ws')
  if (previewAllowed && ws !== null) {
    const slug = ws.trim().toLowerCase()
    if (slug === 'off') res.cookies.delete('preview_ws')
    else if (/^[a-z0-9-]{1,64}$/.test(slug)) {
      res.cookies.set('preview_ws', slug, {
        path: '/', httpOnly: true, sameSite: 'lax',
        secure: process.env.NODE_ENV !== 'development', maxAge: 60 * 60 * 24 * 7,
      })
    }
  }
  return res
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}