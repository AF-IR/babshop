import { supabase } from "@/lib/supabase"

export async function getCart() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", user.id)

  if (error) throw error

  return data ?? []
}

export async function addCartItem(
  productId: string,
  variantId: string,
  quantity: number
) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("variant_id", variantId)
    .maybeSingle()

  if (existing) {
    await supabase
      .from("cart_items")
      .update({
        quantity: existing.quantity + quantity,
      })
      .eq("id", existing.id)

    return
  }

  await supabase.from("cart_items").insert({
    user_id: user.id,
    product_id: productId,
    variant_id: variantId,
    quantity,
  })
}

export async function updateCartItem(
  variantId: string,
  quantity: number
) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("user_id", user.id)
    .eq("variant_id", variantId)
}

export async function removeCartItem(
  variantId: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id)
    .eq("variant_id", variantId)
}

export async function clearCart() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id)
}
