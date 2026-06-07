import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages({ locale })
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      <div className="pt-16">
        {children}
      </div>
      <Footer />
    </NextIntlClientProvider>
  )
}
