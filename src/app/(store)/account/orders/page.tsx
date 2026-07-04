"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Package } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { EmptyState } from "@/components/ui/empty-state"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { getOrders } from "@/lib/orders"

export default function OrdersPage() {
  const { user, isReady } = useAuthGuard()

  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!user) return
      const data = await getOrders(user.id)
      setOrders(data)
      setLoading(false)
    }
    if (isReady) load()
  }, [isReady, user])

  if (!isReady || loading) return null

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <PageHeader
        title="Order History"
        description={`${orders.length} orders`}
      />

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders"
          description="You haven't placed any orders yet."
          actionHref="/shop"
          actionLabel="Start Shopping"
        />
      ) : (
        <div className="space-y-4 mt-8">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="pt-6">
                <p className="font-semibold">{order.order_number}</p>
                <p className="text-sm text-muted-foreground">
                  Status: {order.status}
                </p>
                <p className="text-sm">
                  Total: {order.total.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
