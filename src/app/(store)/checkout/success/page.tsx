"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, ShoppingBag } from "lucide-react"
import { useOrdersStore } from "@/store/orders"
import { formatPrice, formatDate } from "@/lib/utils"
import { PageLoader } from "@/components/ui/page-loader"

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<PageLoader isLoading={true} />}>
      <CheckoutSuccessContent />
    </Suspense>
  )
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const getOrderById = useOrdersStore((s) => s.getOrderById)

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // اسکرول به بالا
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  if (!mounted) {
    return <PageLoader isLoading={true} />
  }

  const order = orderId ? getOrderById(orderId) : undefined

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 font-[family-name:var(--font-vazir)]">
      <div className="flex flex-col items-center text-center">
        <CheckCircle className="h-20 w-20 text-green-600" strokeWidth={1.5} />
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-neutral-800">
          سفارش شما با موفقیت ثبت شد!
        </h1>
        <p className="mt-4 text-neutral-600 max-w-md">
          سفارش شما تأیید شد. به محض ارسال، ایمیل حاوی اطلاعات رهگیری برای شما ارسال خواهد شد.
        </p>

        {order && (
          <Card className="mt-8 w-full text-right border-2 border-green-100 shadow-lg">
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">شماره سفارش</span>
                <span className="font-bold text-neutral-800">{order.order_number}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">تاریخ ثبت</span>
                <span>{formatDate(order.created_at)}</span>
              </div>
              <Separator />
              {(order.items ?? []).map((item, index) => (
                <div
                  key={`${item.product_id}-${index}`}
                  className="flex justify-between text-sm"
                >
                  <span className="text-neutral-600">
                    {item.product_title} &times; {item.quantity}
                  </span>
                  <span className="font-medium text-green-700">{formatPrice(item.total_price)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span className="text-neutral-800">جمع کل</span>
                <span className="text-green-700">{formatPrice(order.total)}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
            <Link href="/account/orders">مشاهده سفارش‌ها</Link>
          </Button>
          <Button variant="outline" asChild className="border-green-200 hover:border-green-500 hover:text-green-600">
            <Link href="/shop">ادامه خرید</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
