'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

const IconFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const IconTiktok = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
  </svg>
);
const IconPhone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IconMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconMapPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const t: Record<string, Record<string, string>> = {
  ro: {
    tagline: 'Imprimare personalizată de calitate',
    catalog: 'Catalog',
    products: 'Toate produsele',
    mugs: 'Cani personalizate',
    tshirts: 'Tricouri & Textile',
    canvas: 'Tablouri Canvas',
    stickers: 'Stickere & Autocolante',
    corporate: 'Corporate / B2B',
    clients: 'Clienți',
    myAccount: 'Contul meu',
    orders: 'Urmărire comandă',
    howToPay: 'Cum achit?',
    delivery: 'Livrare & timpi',
    returns: 'Returnări',
    faq: 'Întrebări frecvente',
    contact: 'Contact',
    address: 'Chișinău, Republica Moldova',
    email: 'contact@i-printsmart.com',
    phone: '+373 069 000 000',
    social: 'Urmărește-ne',
    payment: 'Plăți acceptate',
    copyright: '© 2026 i-PrintSmart. Toate drepturile rezervate.',
    terms: 'Termeni & Condiții',
    privacy: 'Politică confidențialitate',
    gdpr: 'GDPR',
    madeWith: 'Fabricat cu grijă în',
    moldova: 'Moldova',
  },
  ru: {
    tagline: 'Качественная персонализированная печать',
    catalog: 'Каталог',
    products: 'Все продукты',
    mugs: 'Чашки с печатью',
    tshirts: 'Футболки & Текстиль',
    canvas: 'Картины Canvas',
    stickers: 'Стикеры & Наклейки',
    corporate: 'Корпоративные / B2B',
    clients: 'Клиентам',
    myAccount: 'Мой аккаунт',
    orders: 'Отслеживание заказа',
    howToPay: 'Как оплатить?',
    delivery: 'Доставка & сроки',
    returns: 'Возврат',
    faq: 'Частые вопросы',
    contact: 'Контакты',
    address: 'Кишинёв, Республика Молдова',
    email: 'contact@i-printsmart.com',
    phone: '+373 069 000 000',
    social: 'Мы в соцсетях',
    payment: 'Принимаем к оплате',
    copyright: '© 2026 i-PrintSmart. Все права защищены.',
    terms: 'Условия использования',
    privacy: 'Политика конфиденциальности',
    gdpr: 'GDPR',
    madeWith: 'Сделано с любовью в',
    moldova: 'Молдове',
  },
  en: {
    tagline: 'Quality custom printing',
    catalog: 'Catalog',
    products: 'All products',
    mugs: 'Custom mugs',
    tshirts: 'T-shirts & Textiles',
    canvas: 'Canvas prints',
    stickers: 'Stickers & Decals',
    corporate: 'Corporate / B2B',
    clients: 'Customers',
    myAccount: 'My account',
    orders: 'Track order',
    howToPay: 'How to pay?',
    delivery: 'Delivery & times',
    returns: 'Returns',
    faq: 'FAQ',
    contact: 'Contact',
    address: 'Chișinău, Republic of Moldova',
    email: 'contact@i-printsmart.com',
    phone: '+373 069 000 000',
    social: 'Follow us',
    payment: 'We accept',
    copyright: '© 2026 i-PrintSmart. All rights reserved.',
    terms: 'Terms & Conditions',
    privacy: 'Privacy Policy',
    gdpr: 'GDPR',
    madeWith: 'Made with care in',
    moldova: 'Moldova',
  },
};

export default function Footer() {
  const locale = useLocale() as 'ro' | 'ru' | 'en';
  const tr = t[locale] ?? t.ro;

  return (
    <footer style={{
      backgroundColor: '#111110',
      borderTop: '1px solid rgba(196,176,128,0.15)',
      fontFamily: "'Space Grotesk', sans-serif",
      color: '#A09A92',
    }}>
      <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #C4B080 30%, #C4B080 70%, transparent)' }} />

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '56px 24px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '40px',
      }}>

        {/* COL 1 — Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '22px', fontWeight: '700', color: '#F5F4F2', letterSpacing: '-0.5px' }}>
              i-<span style={{ color: '#C4B080' }}>Print</span>Smart
            </span>
          </div>
          <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#6B6660', maxWidth: '200px' }}>
            {tr.tagline}
          </p>
          <div>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#C4B080', marginBottom: '12px' }}>
              {tr.social}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { icon: <IconFacebook />, href: 'https://facebook.com', label: 'Facebook' },
                { icon: <IconInstagram />, href: 'https://instagram.com', label: 'Instagram' },
                { icon: <IconTiktok />, href: 'https://tiktok.com', label: 'TikTok' },
              ].map(({ icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', border: '1px solid rgba(196,176,128,0.2)', color: '#6B6660', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#C4B080'; (e.currentTarget as HTMLElement).style.borderColor = '#C4B080'; (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(196,176,128,0.08)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#6B6660'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,176,128,0.2)'; (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#C4B080', marginBottom: '10px' }}>
              {tr.payment}
            </p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['VISA', 'MC', 'MAIB', 'Cash'].map(method => (
                <span key={method} style={{ fontSize: '10px', fontWeight: '600', padding: '3px 8px', border: '1px solid rgba(196,176,128,0.2)', borderRadius: '4px', color: '#6B6660', letterSpacing: '0.5px' }}>
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* COL 2 — Catalog */}
        <div>
          <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#C4B080', marginBottom: '20px', fontWeight: '600' }}>
            {tr.catalog}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { key: 'products', href: `/${locale}/catalog` },
              { key: 'mugs', href: `/${locale}/catalog?cat=cani` },
              { key: 'tshirts', href: `/${locale}/catalog?cat=textile` },
              { key: 'canvas', href: `/${locale}/catalog?cat=tablouri` },
              { key: 'stickers', href: `/${locale}/catalog?cat=stickere` },
              { key: 'corporate', href: `/${locale}/corporate` },
            ].map(({ key, href }) => (
              <li key={key}>
                <Link href={href}
                  style={{ fontSize: '14px', color: '#6B6660', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#E0DDD8')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#6B6660')}
                >
                  {tr[key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* COL 3 — Clienți */}
        <div>
          <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#C4B080', marginBottom: '20px', fontWeight: '600' }}>
            {tr.clients}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { key: 'myAccount', href: `/${locale}/cont` },
              { key: 'orders', href: `/${locale}/tracking` },
              { key: 'howToPay', href: `/${locale}/cum-achit` },
              { key: 'delivery', href: `/${locale}/livrare` },
              { key: 'returns', href: `/${locale}/returnari` },
              { key: 'faq', href: `/${locale}/faq` },
            ].map(({ key, href }) => (
              <li key={key}>
                <Link href={href}
                  style={{ fontSize: '14px', color: '#6B6660', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#E0DDD8')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#6B6660')}
                >
                  {tr[key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* COL 4 — Contact */}
        <div>
          <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#C4B080', marginBottom: '20px', fontWeight: '600' }}>
            {tr.contact}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: <IconMapPin />, text: tr.address },
              { icon: <IconPhone />, text: tr.phone },
              { icon: <IconMail />, text: tr.email },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#6B6660' }}>
                <span style={{ marginTop: '2px', flexShrink: 0, color: '#C4B080' }}>{icon}</span>
                <span style={{ fontSize: '14px', lineHeight: '1.4' }}>{text}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '24px' }}>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#C4B080', marginBottom: '10px' }}>
              Curierat
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {['Nova Poshta MD', 'Poșta Moldovei', 'Fan Courier (RO)'].map(c => (
                <span key={c} style={{ fontSize: '13px', color: '#6B6660' }}>→ {c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BARA DE JOS */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', maxWidth: '1280px', margin: '0 auto', padding: '20px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <p style={{ fontSize: '12px', color: '#4A4540', margin: 0 }}>
          {tr.copyright}{' — '}
          <span style={{ color: '#6B6660' }}>{tr.madeWith} <span style={{ color: '#C4B080' }}>🇲🇩 {tr.moldova}</span></span>
        </p>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {[
            { key: 'terms', href: `/${locale}/termeni` },
            { key: 'privacy', href: `/${locale}/confidentialitate` },
            { key: 'gdpr', href: `/${locale}/gdpr` },
          ].map(({ key, href }) => (
            <Link key={key} href={href}
              style={{ fontSize: '12px', color: '#4A4540', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C4B080')}
              onMouseLeave={e => (e.currentTarget.style.color = '#4A4540')}
            >
              {tr[key]}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}