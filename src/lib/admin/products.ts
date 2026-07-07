// ======================================================
// src/lib/admin/products.ts
// Product Repository (Admin)
// ======================================================

import { supabaseAdmin } from "@/lib/admin"

export interface AdminProductFilters {
  page?: number
  pageSize?: number
  search?: string
  published?: boolean
  category?: string
}

export async function getProducts(
  filters: AdminProductFilters = {}
) {
  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? 20

  let query = supabaseAdmin
    .from("products")
    .select("*", {
      count: "exact",
    })

  //---------------------------------------

  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`
    )
  }

  //---------------------------------------

  if (
    filters.published !== undefined
  ) {
    query = query.eq(
      "published",
      filters.published
    )
  }

  //---------------------------------------

  if (filters.category) {
    query = query.eq(
      "category",
      filters.category
    )
  }

  //---------------------------------------

  query = query
    .order("created_at", {
      ascending: false,
    })
    .range(
      (page - 1) * pageSize,
      page * pageSize - 1
    )

  //---------------------------------------

  const {
    data,
    error,
    count,
  } = await query

  if (error) throw error

  return {
    items: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
  }
}
//------------------------------------------------------
// Create Product
//------------------------------------------------------

export interface CreateProductInput {
  title: string
  slug: string
  description?: string
  image?: string | null
  price: number
  stock: number
  category?: string | null
  published?: boolean
}

export async function createProduct(
  input: CreateProductInput
) {
  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({
      title: input.title,
      slug: input.slug,
      description: input.description ?? "",
      image: input.image ?? null,
      price: input.price,
      stock: input.stock,
      category: input.category ?? null,
      published: input.published ?? true,
    })
    .select()
    .single()

  if (error) throw error

  return data
}
