// ======================================================
// src/lib/admin/products.ts
// سرویس مدیریت محصولات
// ======================================================

import { supabaseAdmin } from "@/lib/supabase-admin"

export interface AdminProductsFilters {
  page?: number
  limit?: number
  search?: string
  category?: string
  published?: boolean
}

export async function getProducts(
  filters: AdminProductsFilters = {}
) {
  const page = filters.page ?? 1
  const limit = filters.limit ?? 20

  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabaseAdmin
    .from("products")
    .select("*", {
      count: "exact",
    })
    .order("created_at", {
      ascending: false,
    })

  //------------------------------------------------

  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`
    )
  }

  //------------------------------------------------

  if (filters.category) {
    query = query.eq("category", filters.category)
  }

  //------------------------------------------------

  if (filters.published !== undefined) {
    query = query.eq(
      "published",
      filters.published
    )
  }

  //------------------------------------------------

  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) throw error

  return {
    items: data ?? [],
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  }
}
