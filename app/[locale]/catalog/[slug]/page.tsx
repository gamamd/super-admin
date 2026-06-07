import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductEditorWrapper from '@/app/components/ProductEditorWrapper'
import AddToCartButton from '@/app/components/AddToCartButton'

const WORKSPACE_ID = '94722422-b939-44d0-a580-7420eebbb554'

async function getProduct(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, description, price, image_url, is_customizable, category_id, editor_type, available_sizes, available_materials')
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

  const isPhotoProduct = product.editor_type === 'photo' &&
    product.available_sizes?.length > 0 &&
    product.available_materials?.length > 0

  return (
    <main className="px-6 md:px-16 lg:px-24 py-16" style={{ background: "var(--background)" }}>
      <div className="flex gap-2 text-sm mb-12" style={{ color: "var(--text-secondary)" }}>
        <Link href="/" className="hover:opacity-70">Acasă</Link>
        <span>/</span>
        <Link href="/ro/catalog" className="hover:opacity-70">Catalog</Link>
        <span>/</span>
        <span style={{ color: "var(--text-primary)" }}>{product.name}</span>
      </div>

      {isPhotoProduct ? (
        <div>
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              {product.name}
            </h1>
            <p className="text-base" style={{ color: "var(--text-secondary)" }}>
              {product.description}
            </p>
          </div>
          <ProductEditorWrapper
            productId={product.id}
            productName={product.name}
            basePrice={product.price}
            availableSizes={product.available_sizes}
            availableMaterials={product.available_materials}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="aspect-square flex items-center justify-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <span style={{ color: "var(--text-secondary)" }}>Foto produs</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-medium mb-6" style={{ color: "var(--text-primary)" }}>
              {product.name}
            </h1>
            <p className="text-3xl font-medium mb-8" style={{ color: "var(--accent)" }}>
              {product.price} MDL
            </p>
            {product.description && (
              <p className="text-base mb-8 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {product.description}
              </p>
            )}
            <AddToCartButton product={product} />
          </div>
        </div>
      )}
    </main>
  )
}