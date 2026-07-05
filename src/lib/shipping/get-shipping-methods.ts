import { createClient } from "@/lib/supabase/client"
import type { ShippingMethod } from "@/types/shipping"

export async function getShippingMethods(
  totalBoxes: number
): Promise<ShippingMethod[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("shipping_methods")
    .select("*")
    .eq("active", true)
    .lte("min_boxes", totalBoxes)
    .gte("max_boxes", totalBoxes)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error(error)
    return []
  }

  return data as ShippingMethod[]
}
