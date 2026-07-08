"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import { getOrder, updateOrderStatus } from "@/lib/admin/orders-client"

export default function OrderDetails() {
  const params = useParams()
  const id = params.id as string

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const json = await getOrder(id)
    setOrder(json.data)
    setLoading(false)
  }

  async function changeStatus(status: string) {
    await updateOrderStatus(id, status)
    await load()
  }

  if (loading) {
    return <div className="p-6">در حال بارگذاری...</div>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">جزئیات سفارش</h1>

      {/* اطلاعات سفارش */}
      <div className="rounded-lg border p-6 space-y-3">
        <div>
          <b>شناسه:</b> {order.id}
        </div>
        <div>
          <b>مشتری:</b> {order.customer_name}
        </div>
        <div>
          <b>ایمیل:</b> {order.customer_email}
        </div>
        <div>
          <b>وضعیت:</b> {order.status}
        </div>
        <div>
          <b>مبلغ:</b> {Number(order.total).toLocaleString()}
        </div>
      </div>

      {/* اقلام سفارش */}
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-right">کالا</th>
              <th className="p-3 text-right">تعداد</th>
              <th className="p-3 text-right">قیمت</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items?.map((item: any) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.products?.image || "/placeholder.png"}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>{item.products?.title}</div>
                  </div>
                </td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">{Number(item.price).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* دکمه‌های تغییر وضعیت */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => changeStatus("pending")}
          className="rounded bg-gray-700 px-4 py-2 text-white"
        >
          در انتظار
        </button>
        <button
          onClick={() => changeStatus("paid")}
          className="rounded bg-green-700 px-4 py-2 text-white"
        >
          پرداخت شده
        </button>
        <button
          onClick={() => changeStatus("processing")}
          className="rounded bg-blue-700 px-4 py-2 text-white"
        >
          آماده سازی
        </button>
        <button
          onClick={() => changeStatus("shipped")}
          className="rounded bg-purple-700 px-4 py-2 text-white"
        >
          ارسال شد
        </button>
        <button
          onClick={() => changeStatus("delivered")}
          className="rounded bg-emerald-700 px-4 py-2 text-white"
        >
          تحویل شد
        </button>
        <button
          onClick={() => changeStatus("cancelled")}
          className="rounded bg-red-700 px-4 py-2 text-white"
        >
          لغو شد
        </button>
      </div>
    </div>
  )
}
