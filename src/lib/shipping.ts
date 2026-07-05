import { supabase } from "@/lib/supabase"

export type ShippingMethod = {
  id: string
  title: string
  code: string
  description: string | null
  min_boxes: number
  max_boxes: number
  price: number
  cod: boolean
  active: boolean
  sort_order: number
}

export async function getShippingMethods() {
  const { data, error } = await supabase
    .from("shipping_methods")
    .select("*")
    .eq("active", true)
    .order("sort_order")

  if (error) throw error

  return data as ShippingMethod[]
}
