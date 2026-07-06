"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"

import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  Loader2,
} from "lucide-react"

interface DashboardData {
  products: number
  orders: number
  users: number
  categories: number
  pendingOrders: number
  shippedOrders: number
  totalSales: number
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)

  const [data, setData] = useState<DashboardData>({
    products: 0,
    orders: 0,
    users: 0,
    categories: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    totalSales: 0,
  })

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      const res = await fetch("/api/admin/dashboard")

      const json = await res.json()

      if (json.success) {
        setData(json.data)
      } else {
        console.error(json.error)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    )
  }

  return (
    <div>

      <PageHeader
        title="داشبورد مدیریت"
        description="وضعیت کلی فروشگاه"
      />

      <div className="grid gap-5 mt-8 md:grid-cols-2 xl:grid-cols-4">

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-sm">
              فروش کل
            </CardTitle>

            <DollarSign className="h-5 w-5 text-muted-foreground"/>
          </CardHeader>

          <CardContent>

            <div className="text-2xl font-bold">
              {data.totalSales.toLocaleString()}
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              ریال
            </p>

          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-sm">
              سفارش‌ها
            </CardTitle>

            <ShoppingCart className="h-5 w-5 text-muted-foreground"/>
          </CardHeader>

          <CardContent>

            <div className="text-2xl font-bold">
              {data.orders}
            </div>

            <p className="text-xs text-muted-foreground">
              کل سفارش‌ها
            </p>

          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-sm">
              محصولات
            </CardTitle>

            <Package className="h-5 w-5 text-muted-foreground"/>
          </CardHeader>

          <CardContent>

            <div className="text-2xl font-bold">
              {data.products}
            </div>

            <p className="text-xs text-muted-foreground">
              محصول ثبت شده
            </p>

          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-sm">
              کاربران
            </CardTitle>

            <Users className="h-5 w-5 text-muted-foreground"/>
          </CardHeader>

          <CardContent>

            <div className="text-2xl font-bold">
              {data.users}
            </div>

            <p className="text-xs text-muted-foreground">
              عضو سایت
            </p>

          </CardContent>
        </Card>

      </div>

      <div className="grid gap-5 mt-8 md:grid-cols-2">

        <Card>

          <CardHeader>

            <CardTitle>

              سفارش‌های در انتظار

            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="text-4xl font-bold">

              {data.pendingOrders}

            </div>

          </CardContent>

        </Card>

        <Card>

          <CardHeader>

            <CardTitle>

              سفارش‌های ارسال شده

            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="text-4xl font-bold">

              {data.shippedOrders}

            </div>

          </CardContent>

        </Card>

      </div>

    </div>
  )
}
