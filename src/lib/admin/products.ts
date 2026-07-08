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

  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`
    )
  }

  if (filters.published !== undefined) {
    query = query.eq("published", filters.published)
  }

  if (filters.category) {
    query = query.eq("category", filters.category)
  }

  query = query
    .order("created_at", {
      ascending: false,
    })
    .range(
      (page - 1) * pageSize,
      page * pageSize - 1
    )

  const { data, error, count } = await query

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
  body?: string
  image?: string
  price: number
  stock: number
  category_id?: string | null
  brand_id?: string | null
  featured?: boolean
  published?: boolean
  weight?: number | null
  tags?: string[]
}

export async function createProduct(
  input: CreateProductInput
) {
  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({
      title: input.title,
      slug: input.slug,
      description: input.description ?? null,
      body: input.body ?? null,
      image: input.image ?? null,
      price: input.price,
      stock: input.stock,
      category_id: input.category_id ?? null,
      brand_id: input.brand_id ?? null,
      featured: input.featured ?? false,
      published: input.published ?? true,
      weight: input.weight ?? 0,
      tags: input.tags ?? [],
    })
    .select()

  if (error) {
    console.log("SUPABASE ERROR")
    console.log(JSON.stringify(error, null, 2))
    throw error
  }

  return data?.[0]
}

//------------------------------------------------------
// Get Product by ID
//------------------------------------------------------

export async function getProduct(id: string) {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

//------------------------------------------------------
// Update Product
//------------------------------------------------------

export async function updateProduct(
  id: string,
  body: Partial<CreateProductInput>
) {
  const { data, error } = await supabaseAdmin
    .from("products")
    .update(body)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

//------------------------------------------------------
// Delete Product
//------------------------------------------------------

export async function deleteProduct(id: string) {
  const { error } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", id)

  if (error) throw error
}
