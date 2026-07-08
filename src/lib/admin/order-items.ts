import { supabaseAdmin } from "@/lib/admin"

export async function getOrderItems(
  orderId: string
) {
  const { data, error } =
    await supabaseAdmin
      .from("order_items")
      .select(`
        *,
        products(
          id,
          title,
          slug,
          image
        )
      `)
      .eq("order_id", orderId)

  if (error) throw error

  return data ?? []
}
