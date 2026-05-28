import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import OrderStatusUpdater from '@/app/components/OrderStatusUpdater'

const WORKSPACE_ID = '94722422-b939-44d0-a580-7420eebbb554'

async function getOrder(id: string) {
  const { data } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .eq('workspace_id', WORKSPACE_ID)
    .single()
  return data
}

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getOrder(id)

  if (!order) notFound()

  return (
    <main className="px-6 md:px-16 lg:px-24 py-16" style={{ background: "var(--background)" }}>
      <div className="flex items-center gap-4 mb-12">
        <Link href="/admin" className="text-sm hover:opacity-70"
          style={{ color: "var(--text-secondary)" }}>← Admin</Link>
        <span style={{ color: "var(--border)" }}>/</span>
        <span className="text-sm font-medium" style={{ color: "var(--accent)" }}>
          {order.order_number}
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="p-8" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h2 className="text-lg font-medium mb-6" style={{ color: "var(--text-primary)" }}>
              Date client
            </h2>
            {[
              { label: 'Nume', value: order.customer_name },
              { label: 'Email', value: order.customer_email },
              { label: 'Telefon', value: order.customer_phone },
              { label: 'Adresă', value: order.shipping_address?.address },
              { label: 'Oraș', value: order.shipping_address?.city },
              { label: 'Livrare', value: order.delivery_method },
              { label: 'Plată', value: order.payment_method },
            ].map((row) => (
              <div key={row.label} className="flex justify-between py-3"
                style={{ borderBottom: "1px solid var(--border)" }}>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{row.label}</span>
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{row.value}</span>
              </div>
            ))}
          </div>
          {order.notes && (
            <div className="p-8" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <h2 className="text-lg font-medium mb-4" style={{ color: "var(--text-primary)" }}>
                Produse comandate
              </h2>
              {JSON.parse(order.notes).map((item: { name: string, qty: number, price: number }) => (
                <div key={item.name} className="flex justify-between py-3"
                  style={{ borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--text-secondary)" }}>{item.name} × {item.qty}</span>
                  <span style={{ color: "var(--text-primary)" }}>{item.price * item.qty} MDL</span>
                </div>
              ))}
              <div className="flex justify-between pt-4">
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>Total</span>
                <span className="font-medium" style={{ color: "var(--accent)" }}>{order.total_amount} MDL</span>
              </div>
            </div>
          )}
        </div>
        <div className="lg:col-span-1">
          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
        </div>
      </div>
    </main>
  )
}
