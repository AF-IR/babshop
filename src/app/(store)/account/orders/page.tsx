"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Package } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { EmptyState } from "@/components/ui/empty-state"
import { PageLoader } from "@/components/ui/page-loader"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { getOrders } from "@/lib/orders"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatDate } from "@/lib/utils"

// تابع برای دریافت رنگ وضعیت
function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    delivered: "bg-green-600 text-white",        // تحویل شده ✅
    paid: "bg-green-600 text-white",             // پرداخت شده ✅
    processing: "bg-blue-500 text-white",        // در حال پردازش 🔵
    pending: "bg-yellow-500 text-white",         // در انتظار پرداخت 🟡
    cancelled: "bg-red-600 text-white",          // لغو شده ❌
    failed: "bg-red-600 text-white",             // ناموفق ❌
    shipped: "bg-purple-500 text-white",         // ارسال شده 🟣
  }
  return statusMap[status.toLowerCase()] || "bg-neutral-500 text-white"
}

// تابع برای ترجمه وضعیت سفارش
function getPersianStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "در انتظار پرداخت",
    processing: "در حال پردازش",
    paid: "پرداخت شده",
    shipped: "ارسال شده",
    delivered: "تحویل داده شده",
    cancelled: "لغو شده",
    failed: "ناموفق",
  }
  return statusMap[status.toLowerCase()] || status
}

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

  // اسکرول به بالای صفحه بعد از رفرش
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // نمایش لودر تا زمانی که احراز هویت کامل نشده
  if (!isReady || loading) {
    return <PageLoader isLoading={true} />
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 font-[family-name:var(--font-vazir)]">
      <PageHeader
        title="تاریخچه سفارش‌ها"
        description={`${orders.length} سفارش`}
      />

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="هیچ سفارشی ثبت نشده"
          description="شما هنوز هیچ سفارشی ثبت نکرده‌اید."
          actionHref="/shop"
          actionLabel="شروع خرید"
        />
      ) : (
        <div className="space-y-4 mt-8">
          {orders.map((order) => (
            <Card key={order.id} className="border border-neutral-200 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-neutral-800 text-lg">{order.order_number}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <Badge className={`${getStatusColor(order.status)} text-xs px-3 py-0.5 border-0`}>
                        {getPersianStatus(order.status)}
                      </Badge>
                      <span className="text-sm text-neutral-500">
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-green-700">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
