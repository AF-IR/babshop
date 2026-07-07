// ======================================================
// src/lib/admin/product.ts
// عملیات روی یک محصول
// ======================================================

import { supabaseAdmin } from "@/lib/supabase-admin"

export async function getProduct(id: string) {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error

  return data
}

export async function updateProduct(
  id: string,
  values: {
    title: string
    slug: string
    description: string
    image: string | null
    price: number
    stock: number
    category: string | null
    published: boolean
  }
) {
  const { data, error } = await supabaseAdmin
    .from("products")
    .update(values)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  return data
}

export async function deleteProduct(id: string) {
  const { error } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", id)

  if (error) throw error

  return true
}
