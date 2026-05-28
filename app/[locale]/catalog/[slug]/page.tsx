import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const WORKSPACE_ID = '94722422-b939-44d0-a580-7420eebbb554'

async function getProduct(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, description, price, image_url, is_customizable, category_id')
    .eq('workspace_id', WORKSPACE_ID)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  return data
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) notFound()

  return (
    <main className="px-6 md:px-16 lg:px-24 py-16" style={{ background: "var(--background)" }}>
      
      <div className="flex gap-2 text-sm mb-12" style={{ color: "var(--text-secondary)" }}>
        <Link href="/" className="hover:opacity-70">Acasă</Link>
        <span>/</span>
        <Link href="/catalog" className="hover:opacity-70">Catalog</Link>
        <span>/</span>
        <span style={{ color: "var(--text-primary)" }}>{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        
        <div className="aspect-square flex items-center justify-center"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <span style={{ color: "var(--text-secondary)" }}>Foto produs</span>
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-medium mb-6"
            style={{ color: "var(--text-primary)" }}>
            {product.name}
          </h1>

          <p className="text-3xl font-medium mb-8"
            style={{ color: "var(--accent)" }}>
            {product.price} MDL
          </p>

          {product.description && (
            <p className="text-base mb-8 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}>
              {product.description}
            </p>
          )}

          {product.is_customizable && (
            <div className="inline-block px-3 py-1 text-sm mb-8"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
              Produs personalizabil
            </div>
          )}

          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Cantitate:</span>
            <div className="flex items-center" style={{ border: "1px solid var(--border)" }}>
              <button className="px-4 py-2 hover:opacity-70 transition-opacity"
                style={{ color: "var(--text-primary)" }}>−</button>
              <span className="px-4 py-2 text-center w-12"
                style={{ color: "var(--text-primary)", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}>1</span>
              <button className="px-4 py-2 hover:opacity-70 transition-opacity"
                style={{ color: "var(--text-primary)" }}>+</button>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <button className="px-8 py-4 text-base font-medium transition-opacity hover:opacity-80"
              style={{ background: "var(--text-primary)", color: "var(--background)" }}>
              Adaugă în coș
            </button>
            {product.is_customizable && (
              <button className="px-8 py-4 text-base font-medium transition-opacity hover:opacity-80"
                style={{ border: "1px solid var(--accent)", color: "var(--accent)" }}>
                Personalizează
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}