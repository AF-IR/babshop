// ======================================================
// src/lib/admin/orders.ts
// سرویس مدیریت سفارش‌ها
// ======================================================

import { supabaseAdmin } from "@/lib/supabase-admin"

//------------------------------------------------------
// فیلترها
//------------------------------------------------------

export interface AdminOrderFilters {
  page?: number
  limit?: number
  search?: string
  status?: string
}

//------------------------------------------------------
// دریافت لیست سفارش‌ها
//------------------------------------------------------

export async function getOrders(filters: AdminOrderFilters = {}) {
  const page = filters.page ?? 1
  const limit = filters.limit ?? 20

  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabaseAdmin
    .from("orders")
    .select("*", {
      count: "exact",
    })
    .order("created_at", {
      ascending: false,
    })

  //------------------------------------------------------
  // وضعیت سفارش
  //------------------------------------------------------

  if (filters.status) {
    query = query.eq("status", filters.status)
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
  // صفحه‌بندی
  //------------------------------------------------------

  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    throw error
  }

  return {
    items: data ?? [],
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  }
}
