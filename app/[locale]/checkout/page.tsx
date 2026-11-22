import { getSiteWorkspace } from '@/lib/tenant'
import SiteUnavailable from '@/app/components/SiteUnavailable'
import CheckoutForm from './CheckoutForm'

export default async function CheckoutPage() {
  const ws = await getSiteWorkspace()
  if (!ws) return <SiteUnavailable />
  return <CheckoutForm workspaceId={ws.id} />
}
