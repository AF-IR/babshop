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
      quantity,
      product_id,
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
    console.error(error)
    return []
  }

  return (data ?? []).map((item: any) => ({
    id: item.id,
    productId: item.product_id,
    variantId: item.product_id,
    name: item.products.title,
    variantName: "",
    slug: item.products.slug,
    image: {
      url: item.products.image,
      alt: item.products.title,
    },
    price: item.products.price,
    quantity: item.quantity,
    lineTotal: item.quantity * item.products.price,
  }))
}

export async function addItem(params: {
  productId: string
  quantity?: number
}): Promise<CartItem[]> {

  const {
    data: { user },
  } = await getUser()

  if (!user)
    throw new Error("NOT_AUTHENTICATED")

  const quantity = params.quantity ?? 1

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id,quantity")
    .eq("user_id", user.id)
    .eq("product_id", params.productId)
    .maybeSingle()

  if (existing) {

    await supabase
      .from("cart_items")
      .update({
        quantity: existing.quantity + quantity,
      })
      .eq("id", existing.id)

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

export async function removeItem(
  productId: string
): Promise<CartItem[]> {

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

export async function updateQuantity(
  productId: string,
  quantity: number
): Promise<CartItem[]> {

  const {
    data: { user },
  } = await getUser()

  if (!user) return []

  if (quantity <= 0) {
    return removeItem(productId)
  }

  await supabase
    .from("cart_items")
    .update({
      quantity,
    })
    .eq("user_id", user.id)
    .eq("product_id", productId)

  return getCart()
}

export async function clearCart() {

  const {
    data: { user },
  } = await getUser()

  if (!user) return

  await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id)
}

export async function mergeGuestCart(
  guestItems: any[]
): Promise<CartItem[]> {

  const {
    data: { user },
  } = await getUser()

  if (!user)
    return []

  for (const guest of guestItems) {

    const { data: existing } = await supabase
      .from("cart_items")
      .select("id,quantity")
      .eq("user_id", user.id)
      .eq("product_id", guest.productId)
      .maybeSingle()

    if (existing) {

      await supabase
        .from("cart_items")
        .update({
          quantity:
            existing.quantity + guest.quantity,
        })
        .eq("id", existing.id)

    } else {

      await supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_id: guest.productId,
          quantity: guest.quantity,
        })

    }

  }

  return getCart()
}
