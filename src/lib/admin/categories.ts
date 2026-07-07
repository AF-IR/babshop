// =====================================================
// src/lib/admin/categories.ts
// Category Repository
// =====================================================

import { supabaseAdmin } from "../supabase-admin"

export interface AdminCategoryFilters {
  page?: number
  pageSize?: number
  search?: string
}

export async function getCategories(
  filters: AdminCategoryFilters = {}
) {
  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? 20

  let query = supabaseAdmin
    .from("categories")
    .select("*", {
      count: "exact",
    })

  if (filters.search) {
    query = query.ilike("title", `%${filters.search}%`)
  }

  query = query
    .order("created_at", {
      ascending: false,
    })
    .range(
      (page - 1) * pageSize,
      page * pageSize - 1
    )

  const { data, error, count } =
    await query

  if (error) throw error

  return {
    data: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
  }
}

//------------------------------------------------------

export async function createCategory(input: {
  title: string
  slug: string
  description?: string
}) {
  const { data, error } =
    await supabaseAdmin
      .from("categories")
      .insert(input)
      .select()
      .single()

  if (error) throw error

  return data
}

//------------------------------------------------------

export async function updateCategory(
  id: string,
  input: Partial<{
    title: string
    slug: string
    description: string
  }>
) {
  const { data, error } =
    await supabaseAdmin
      .from("categories")
      .update(input)
      .eq("id", id)
      .select()
      .single()

  if (error) throw error

  return data
}

//------------------------------------------------------

export async function deleteCategory(
  id: string
) {
  const { error } =
    await supabaseAdmin
      .from("categories")
      .delete()
      .eq("id", id)

  if (error) throw error

  return true
}
