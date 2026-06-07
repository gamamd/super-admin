import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'

const DEFAULT_WORKSPACE = '94722422-b939-44d0-a580-7420eebbb554'

async function getWorkspaceId(): Promise<string> {
  const cookieStore = await cookies()
  return cookieStore.get('active_workspace')?.value || DEFAULT_WORKSPACE
}

async function getStats(workspaceId: string) {
  const { data } = await supabaseAdmin
    .from('orders')
    .select('total_amount, status')
    .eq('workspace_id', workspaceId)
  const total = data?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0
  const count = data?.length || 0
  const new_orders = data?.filter(o => o.status === 'new').length || 0
  return { total, count, new_orders }
}

async function getRecentOrders(workspaceId: string) {
  const { data } = await supabaseAdmin
    .from('orders')
    .select('id, order_number, customer_name, total_amount, status, created_at')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .limit(5)
  return data || []
}

async function getWorkspaceName(workspaceId: string): Promise<string> {
  const { data } = await supabaseAdmin
    .from('workspaces')
    .select('name')
    .eq('id', workspaceId)
    .single()
  return data?.name || 'Admin'
}

export default async function AdminPage() {
  const workspaceId = await getWorkspaceId()
  const [stats, orders, workspaceName] = await Promise.all([
    getStats(workspaceId),
    getRecentOrders(workspaceId),
    getWorkspaceName(workspaceId),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          {workspaceName} — vedere generală
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total comenzi', value: stats.count },
          { label: 'Comenzi noi', value: stats.new_orders },
          { label: 'Venituri totale', value: stats.total + ' MDL' },
        ].map((stat) => (
          <div key={stat.label} className="p-6 rounded-lg bg-white"
            style={{ border: "1px solid var(--border)" }}>
            <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>{stat.label}</p>
            <p className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-6" style={{ border: "1px solid var(--border)" }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>Comenzi recente</h2>
          <Link href="/ro/admin/comenzi" className="text-sm" style={{ color: "var(--accent)" }}>
            Vezi toate →
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Nu există comenzi încă.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {['Comandă', 'Client', 'Total', 'Status', 'Data'].map((h) => (
                  <th key={h} className="text-left py-2 pr-4 font-medium"
                    style={{ color: "var(--text-secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="py-3 pr-4 font-medium" style={{ color: "var(--accent)" }}>
                    <Link href={`/ro/admin/comenzi/${order.id}`}>{order.order_number}</Link>
                  </td>
                  <td className="py-3 pr-4" style={{ color: "var(--text-primary)" }}>{order.customer_name}</td>
                  <td className="py-3 pr-4 font-medium" style={{ color: "var(--text-primary)" }}>{order.total_amount} MDL</td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-1 text-xs rounded"
                      style={{
                        background: order.status === 'new' ? '#fef3c7' : '#f3f4f6',
                        color: order.status === 'new' ? '#92400e' : '#6b7280'
                      }}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3" style={{ color: "var(--text-secondary)" }}>
                    {new Date(order.created_at).toLocaleDateString('ro-MD')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
