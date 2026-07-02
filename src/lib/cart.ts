import { supabase } from "@/lib/supabase"
import { getUser } from "@/lib/auth"
import type { CartItem } from "@/types"

// ❌ withTimeout حذف شد - مستقیماً از await استفاده می‌کنیم

export async function getCart(): Promise<CartItem[]> {
  const user = await getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      id,
      product_id,
      variant_id,
      quantity,
      products (name, slug, images),
      variants (name, price, currency)
    `)
    .eq("user_id", user.id)

  if (error) {
    console.error("getCart error:", error)
    return []
  }

  return data.map((item: any) => ({
    id: item.id,
    variantId: item.variant_id,
    productId: item.product_id,
    quantity: item.quantity,
    name: item.products?.name || "",
    variantName: item.variants?.name || "",
    image: item.products?.images?.[0] ?? { url: "", alt: "" },
    slug: item.products?.slug || "",
    price: item.variants?.price || 0,
    lineTotal: (item.variants?.price || 0) * item.quantity,
  }))
}

export async function addItem(params: {
  variantId: string
  productId: string
  quantity?: number
}): Promise<CartItem[]> {
  const user = await getUser()
  if (!user) {
    throw new Error("NOT_AUTHENTICATED")
  }

  const quantity = params.quantity ?? 1

  const { data: existing, error: fetchError } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("variant_id", params.variantId)
    .maybeSingle()

  if (fetchError) {
    console.error("fetch existing cart item error:", fetchError)
    throw fetchError
  }

  if (existing) {
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id)

    if (updateError) {
      console.error("update cart item error:", updateError)
      throw updateError
    }
  } else {
    const { error: insertError } = await supabase
      .from("cart_items")
      .insert({
        user_id: user.id,
        product_id: params.productId,
        variant_id: params.variantId,
        quantity,
      })

    if (insertError) {
      console.error("insert cart item error:", insertError)
      throw insertError
    }
  }

  return getCart()
}

export async function removeItem(variantId: string): Promise<CartItem[]> {
  const user = await getUser()
  if (!user) return []

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id)
    .eq("variant_id", variantId)

  if (error) {
    console.error("removeItem error:", error)
    throw error
  }

  return getCart()
}

export async function updateQuantity(
  variantId: string,
  quantity: number
): Promise<CartItem[]> {
  const user = await getUser()
  if (!user) return []

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("user_id", user.id)
    .eq("variant_id", variantId)

  if (error) {
    console.error("updateQuantity error:", error)
    throw error
  }

  return getCart()
}

export async function clearCart(): Promise<void> {
  const user = await getUser()
  if (!user) return

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id)

  if (error) {
    console.error("clearCart error:", error)
    throw error
  }
}

export async function mergeGuestCart(guestItems: any[]): Promise<CartItem[]> {
  const user = await getUser()
  if (!user || !guestItems.length) return getCart()

  for (const guest of guestItems) {
    try {
      const { data: existing, error: fetchError } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("variant_id", guest.variantId)
        .maybeSingle()

      if (fetchError) {
        console.error("merge guest fetch error:", fetchError)
        continue
      }

      if (existing) {
        await supabase
          .from("cart_items")
          .update({ quantity: existing.quantity + guest.quantity })
          .eq("id", existing.id)
      } else {
        await supabase
          .from("cart_items")
          .insert({
            user_id: user.id,
            product_id: guest.productId,
            variant_id: guest.variantId,
            quantity: guest.quantity,
          })
      }
    } catch (err) {
      console.error("mergeGuestCart item error:", err)
    }
  }

  return getCart()
}
