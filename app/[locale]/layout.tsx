import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { getSiteWorkspace, themeCss, brandName } from '@/lib/tenant'

const LOCALES = ['ro', 'ru', 'en']

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Limbă necunoscută (ex. /api) → 404, nu 500 din lipsa fișierului de mesaje.
  if (!LOCALES.includes(locale)) notFound()
  const messages = await getMessages({ locale })
  const ws = await getSiteWorkspace()
  const css = themeCss(ws)
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null}
      <Header brand={brandName(ws)} />
      <div className="pt-16">
        {children}
      </div>
      <Footer />
    </NextIntlClientProvider>
  )
}
