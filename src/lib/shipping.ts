import { supabase } from "@/lib/supabase"

export interface ShippingMethod {

  id: string

  title: string

  type: "fixed" | "cod" | "free"

  price: number

  estimatedDays: string

}

export async function getShippingMethods(
  boxCount: number
): Promise<ShippingMethod[]> {

  const { data, error } = await supabase

    .from("shipping_rules")

    .select("*")

    .eq("active", true)

    .order("price")

  if (error)
    throw error

  const methods = (data ?? []).filter(rule => {

    if (rule.max_boxes == null)
      return true

    return boxCount <= rule.max_boxes

  })

  return methods.map(rule => ({

    id: rule.id,

    title: rule.title,

    type: rule.type,

    price: rule.price,

    estimatedDays:
      rule.estimated_days ?? "",

  }))

}
