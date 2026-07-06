// ======================================================
// src/lib/admin/orders.ts
// سرویس مدیریت سفارش‌ها
// ======================================================

import { supabaseAdmin } from "@/lib/supabase-admin"

export interface AdminOrderFilters {
  page?: number
  pageSize?: number
  status?: string
  paymentStatus?: string
  search?: string
}

export async function getOrders(
  filters: AdminOrderFilters = {}
) {
  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? 20

  let query = supabaseAdmin
    .from("orders")
    .select("*", {
      count: "exact",
    })

  //------------------------------------------------------
  // وضعیت سفارش
  //------------------------------------------------------

  if (filters.status) {
    query = query.eq("status", filters.status)
  }

  //------------------------------------------------------
  // وضعیت پرداخت
  //------------------------------------------------------

  if (filters.paymentStatus) {
    query = query.eq(
      "payment_status",
      filters.paymentStatus
    )
  }

  //------------------------------------------------------
  // جستجو
  //------------------------------------------------------

  if (filters.search) {
    query = query.or(
      `order_number.ilike.%${filters.search}%,receiver_name.ilike.%${filters.search}%`
    )
  }

  //------------------------------------------------------
  // صفحه بندی
  //------------------------------------------------------

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  query = query
    .order("created_at", {
      ascending: false,
    })
    .range(from, to)

  const { data, count, error } =
    await query

  if (error) throw error

  return {
    items: data,
    total: count ?? 0,
    page,
    pageSize,
  }
}
