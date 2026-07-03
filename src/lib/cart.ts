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
      product:products(
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

  return (data ?? []).map((row: any) => ({
    id: row.id,

    productId: row.product.id,

    variantId: row.product.id,

    quantity: row.quantity,

    name: row.product.title,

    variantName: "",

    image: {
      url: row.product.image,
      alt: row.product.title,
    },

    slug: row.product.slug,

    price: row.product.price,

    lineTotal: row.product.price * row.quantity,
  }))
}

export async function addItem({
  productId,
  quantity = 1,
}: {
  productId: string
  quantity?: number
}) {
  const {
    data: { user },
  } = await getUser()

  if (!user)
    throw new Error("NOT_AUTHENTICATED")

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id,quantity")
    .eq("user_id", user.id)
    .eq("product_id", productId)
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
        product_id: productId,
        quantity,
      })
  }

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

export async function updateQuantity(
  productId: string,
  quantity: number
) {
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
