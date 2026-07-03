import { supabase } from "@/lib/supabase"
import { getUser } from "@/lib/auth"
import type { CartItem } from "@/types"

export async function getCart(): Promise<CartItem[]> {
  const {
    data: { user },
  } = await getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      id,
      product_id,
      quantity,
      products (
        id,
        title,
        slug,
        image,
        price
      )
    `)
    .eq("user_id", user.id)

  if (error) {
    console.error("Supabase Error:", error)
    return []
  }

  console.log("========== getCart RAW ==========")
  console.log(data)

  return (data ?? []).map((row: any) => {
    console.log("ROW =", row)
    console.log("PRODUCT =", row.products)
    console.log(Array.isArray(row.products))

    return {
      id: row.id,
      variantId: row.product_id,
      productId: row.product_id,
      name: row.products?.title ?? "NULL",
      slug: row.products?.slug ?? "",
      variantName: "Default",
      image: {
        url: row.products?.image ?? "",
        alt: row.products?.title ?? "",
      },
      price: row.products?.price ?? 0,
      quantity: row.quantity,
      lineTotal: (row.products?.price ?? 0) * row.quantity,
    }
  })
}

export async function addItem(params: {
  productId: string
  quantity?: number
}) {
  const {
    data: { user },
  } = await getUser()

  if (!user) throw new Error("NOT_AUTHENTICATED")

  const quantity = params.quantity ?? 1

  const { data: exists } = await supabase
    .from("cart_items")
    .select("id,quantity")
    .eq("user_id", user.id)
    .eq("product_id", params.productId)
    .maybeSingle()

  if (exists) {
    await supabase
      .from("cart_items")
      .update({
        quantity: exists.quantity + quantity,
      })
      .eq("id", exists.id)
  } else {
    await supabase
      .from("cart_items")
      .insert({
        user_id: user.id,
        product_id: params.productId,
        quantity,
      })
  }

  return getCart()
}

export async function updateQuantity(productId: string, quantity: number) {
  const {
    data: { user },
  } = await getUser()

  if (!user) return []

  if (quantity <= 0) return removeItem(productId)

  await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("user_id", user.id)
    .eq("product_id", productId)

  return getCart()
}

export async function removeItem(productId: string) {
  const {
    data: { user },
  } = await getUser()

  if (!user) return []

  await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id)
    .eq("product_id", productId)

  return getCart()
}

export async function clearCart() {
  const {
    data: { user },
  } = await getUser()

  if (!user) return

  await supabase.from("cart_items").delete().eq("user_id", user.id)
}

// ========== MERGE GUEST CART ==========
export async function mergeGuestCart(
  guestItems: {
    productId: string
    quantity: number
  }[]
) {
  const {
    data: { user },
  } = await getUser()

  if (!user) throw new Error("NOT_AUTHENTICATED")

  for (const item of guestItems) {
    const { data: exists } = await supabase
      .from("cart_items")
      .select("id,quantity")
      .eq("user_id", user.id)
      .eq("product_id", item.productId)
      .maybeSingle()

    if (exists) {
      await supabase
        .from("cart_items")
        .update({
          quantity: exists.quantity + item.quantity,
        })
        .eq("id", exists.id)
    } else {
      await supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_id: item.productId,
          quantity: item.quantity,
        })
    }
  }

  return getCart()
}
