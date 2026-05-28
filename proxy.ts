import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['ro', 'ru', 'en'],
  defaultLocale: 'ro'
})

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)']
}