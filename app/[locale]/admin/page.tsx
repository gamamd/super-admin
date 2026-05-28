import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const WORKSPACE_ID = '94722422-b939-44d0-a580-7420eebbb554'

async function getOrders() {
  const { data } = await supabase
    .from('orders')
    .select('id, order_number, customer_name, customer_email, customer_phone, total_amount, status, payment_status, delivery_method, created_at')
    .eq('workspace_id', WORKSPACE_ID)
    .order('created_at', { ascending: false })
  return data || []
}

async function getStats() {
  const { data } = await supabase
    .from('orders')
    .select('total_amount, status')
    .eq('workspace_id', WORKSPACE_ID)

  const total = data?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0
  const count = data?.length || 0
  const new_orders = data?.filter(o => o.status === 'new').length || 0

  return { total, count, new_orders }
}

export default async function AdminPage() {
  const [orders, stats] = await Promise.all([getOrders(), getStats()])

  return (
    <main className="px-6 md:px-16 lg:px-24 py-16" style={{ background: "var(--background)" }}>

      <div className="mb-12">
        <p className="text-sm font-medium tracking-widest uppercase mb-4"
          style={{ color: "var(--accent)" }}>Admin</p>
        <h1 className="text-4xl font-medium" style={{ color: "var(--text-primary)" }}>
          Dashboard i-PrintSmart
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { label: 'Total comenzi', value: stats.count },
          { label: 'Comenzi noi', value: stats.new_orders },
          { label: 'Venituri totale', value: stats.total + ' MDL' },
        ].map((stat) => (
          <div key={stat.label} className="p-8"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>{stat.label}</p>
            <p className="text-3xl font-medium" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Comenzi */}
      <div>
        <h2 className="text-xl font-medium mb-6" style={{ color: "var(--text-primary)" }}>
          Comenzi recente
        </h2>

        {orders.length === 0 ? (
          <p style={{ color: "var(--text-secondary)" }}>Nu există comenzi încă.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {['Comandă', 'Client', 'Email', 'Telefon', 'Total', 'Status', 'Livrare', 'Data'].map((h) => (
                    <th key={h} className="text-left py-3 pr-6 font-medium"
                      style={{ color: "var(--text-secondary)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td className="py-4 pr-6 font-medium" style={{ color: "var(--accent)" }}>
                      {order.order_number}
                    </td>
                    <td className="py-4 pr-6" style={{ color: "var(--text-primary)" }}>
                      {order.customer_name}
                    </td>
                    <td className="py-4 pr-6" style={{ color: "var(--text-secondary)" }}>
                      {order.customer_email}
                    </td>
                    <td className="py-4 pr-6" style={{ color: "var(--text-secondary)" }}>
                      {order.customer_phone}
                    </td>
                    <td className="py-4 pr-6 font-medium" style={{ color: "var(--text-primary)" }}>
                      {order.total_amount} MDL
                    </td>
                    <td className="py-4 pr-6">
                      <span className="px-2 py-1 text-xs"
                        style={{
                          background: order.status === 'new' ? '#fef3c7' : 'var(--surface)',
                          color: order.status === 'new' ? '#92400e' : 'var(--text-secondary)'
                        }}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 pr-6" style={{ color: "var(--text-secondary)" }}>
                      {order.delivery_method}
                    </td>
                    <td className="py-4" style={{ color: "var(--text-secondary)" }}>
                      {new Date(order.created_at).toLocaleDateString('ro-MD')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}