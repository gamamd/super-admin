import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Header from '@/app/components/Header'

const locales = ['ro', 'ru', 'en']

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale)) {
    notFound()
  }

  const messages = await getMessages({ locale })

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <div className="pt-16">
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}