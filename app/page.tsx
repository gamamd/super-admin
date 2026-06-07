import { getCategories } from '@/lib/queries'
import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'

async function getFeaturedProducts() {
  const { data } = await supabaseAdmin
    .from('products')
    .select('id, name, description, price, slug')
    .eq('workspace_id', '94722422-b939-44d0-a580-7420eebbb554')
    .limit(6)
  return data || []
}

export default async function HomePage() {
  const categories = await getCategories()
  const products = await getFeaturedProducts()

  return (
    <main>

      <section className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24"
        style={{ background: "var(--background)" }}>
        <div className="max-w-4xl">
          <p className="text-sm font-medium tracking-widest uppercase mb-6"
            style={{ color: "var(--accent)" }}>
            i-printsmart
          </p>
          <h1 className="text-5xl md:text-7xl font-medium leading-tight mb-8"
            style={{ color: "var(--text-primary)" }}>
            Imprimare personalizată profesională
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-xl"
            style={{ color: "var(--text-secondary)" }}>
            Cadouri unice, textile branduite și produse personalizate.
            Livrare în Moldova și România.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/ro/catalog"
              className="px-8 py-4 text-base font-medium transition-opacity hover:opacity-80"
              style={{ background: "var(--text-primary)", color: "var(--background)" }}>
              Vezi produsele
            </Link>
            <a href="#b2b"
              className="px-8 py-4 text-base font-medium transition-opacity hover:opacity-80"
              style={{ border: "1px solid var(--border)", color: "var(--text-primary)" }}>
              Ofertă B2B
            </a>
          </div>
        </div>
      </section>

      <div className="h-px mx-6 md:mx-16 lg:px-24" style={{ background: "var(--border)" }} />

      <section className="px-6 md:px-16 lg:px-24 py-24"
        style={{ background: "var(--surface)" }}>
        <p className="text-sm font-medium tracking-widest uppercase mb-12"
          style={{ color: "var(--text-secondary)" }}>
          Categorii principale
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories && categories.map((cat) => (
            <Link key={cat.id} href={`/ro/catalog`}
              className="p-8 cursor-pointer transition-all hover:opacity-80"
              style={{ background: "var(--background)", border: "1px solid var(--border)", textDecoration: 'none' }}>
              <h3 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
                {cat.name}
              </h3>
              <p style={{ color: "var(--text-secondary)" }}>
                {cat.description || ''}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="h-px mx-6 md:mx-16 lg:px-24" style={{ background: "var(--border)" }} />

      <section className="px-6 md:px-16 lg:px-24 py-24"
        style={{ background: "var(--background)" }}>
        <div className="flex justify-between items-end mb-12">
          <p className="text-sm font-medium tracking-widest uppercase"
            style={{ color: "var(--text-secondary)" }}>
            Produse populare
          </p>
          <Link href="/ro/catalog"
            className="text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--accent)" }}>
            Vezi toate →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/ro/catalog/${product.slug}`}
              style={{ textDecoration: 'none' }}>
              <div className="group cursor-pointer" style={{ border: "1px solid var(--border)" }}>
                <div className="w-full h-48 flex items-center justify-center"
                  style={{ background: "var(--surface)" }}>
                  <span className="text-4xl">🖨️</span>
                </div>
                <div className="p-6">
                  <h3 className="text-base font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                    {product.name}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                    {product.description || ''}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold" style={{ color: "var(--accent)" }}>
                      {product.price ? `${product.price} MDL` : 'Preț la cerere'}
                    </span>
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      Personalizează →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="h-px mx-6 md:mx-16 lg:px-24" style={{ background: "var(--border)" }} />

      <section className="px-6 md:px-16 lg:px-24 py-24"
        style={{ background: "var(--surface)" }}>
        <p className="text-sm font-medium tracking-widest uppercase mb-12"
          style={{ color: "var(--text-secondary)" }}>
          De ce i-PrintSmart
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { nr: '01', titlu: 'Calitate profesională', text: 'Utilaje DTF și UV de ultimă generație. Culori vii, rezistente la spălare și uzură.' },
            { nr: '02', titlu: 'Livrare rapidă', text: 'Producție 2–3 zile. Livrare prin Nova Poshta în toată Moldova și Fan Courier în România.' },
            { nr: '03', titlu: 'Personalizare completă', text: 'Logo, text, foto — orice dorești. Minim 1 bucată, fără comandă minimă pentru B2C.' },
          ].map(({ nr, titlu, text }) => (
            <div key={nr}>
              <p className="text-4xl font-bold mb-4" style={{ color: "var(--accent)", opacity: 0.4 }}>{nr}</p>
              <h3 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>{titlu}</h3>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px mx-6 md:mx-16 lg:px-24" style={{ background: "var(--border)" }} />

      <section id="b2b" className="px-6 md:px-16 lg:px-24 py-32"
        style={{ background: "var(--background)" }}>
        <div className="max-w-3xl">
          <p className="text-sm font-medium tracking-widest uppercase mb-6"
            style={{ color: "var(--accent)" }}>
            Corporate / B2B
          </p>
          <h2 className="text-4xl md:text-5xl font-medium leading-tight mb-8"
            style={{ color: "var(--text-primary)" }}>
            Brandingul firmei tale, imprimat cu precizie
          </h2>
          <p className="text-xl mb-12 max-w-xl leading-relaxed"
            style={{ color: "var(--text-secondary)" }}>
            Tricouri, cani, stickere și materiale promoționale pentru companii din Chișinău și România.
            Prețuri speciale de la 20 de bucăți. Factură fiscală inclusă.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a href="mailto:contact@i-printsmart.com"
              className="px-8 py-4 text-base font-medium transition-opacity hover:opacity-80"
              style={{ background: "var(--accent)", color: "#1A1A1A" }}>
              Solicită ofertă
            </a>
            <a href="tel:+37306900000"
              className="px-8 py-4 text-base font-medium transition-opacity hover:opacity-80"
              style={{ border: "1px solid var(--border)", color: "var(--text-primary)" }}>
              +373 069 000 000
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}