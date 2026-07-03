import { supabase } from "@/lib/supabase"
import { getUser } from "@/lib/auth"
import type { CartItem } from "@/types"

// ==================== getCart بازنویسی شده ====================
export async function getCart(): Promise<CartItem[]> {
  const {
    data: { user },
  } = await getUser()

  if (!user) return []

  // دریافت آیتم‌های سبد
  const { data: cartItems, error: cartError } = await supabase
    .from("cart_items")
    .select("id, product_id, quantity")
    .eq("user_id", user.id)

  if (cartError) {
    console.error(cartError)
    return []
  }

  if (!cartItems?.length) return []

  // لیست شناسه محصولات
  const productIds = cartItems.map((i) => i.product_id)

  // دریافت اطلاعات محصولات
  const { data: products, error: productError } = await supabase
    .from("products")
    .select("id, title, slug, image, price")
    .in("id", productIds)

  if (productError) {
    console.error(productError)
    return []
  }

  // ساخت Map برای سرعت O(1)
  const productMap = new Map(
    (products ?? []).map((p) => [p.id, p])
  )

  return cartItems.map((item) => {
    const product = productMap.get(item.product_id)

    return {
      id: item.id,
      variantId: item.product_id,
      productId: item.product_id,

      name: product?.title ?? "Unknown Product",

      slug: product?.slug ?? "",

      variantName: "Default",

      image: {
        url: product?.image ?? "",
        alt: product?.title ?? "",
      },

      price: product?.price ?? 0,

      quantity: item.quantity,

      lineTotal: (product?.price ?? 0) * item.quantity,
    }
  })
}
// =============================================================

export async function addItem(params: {
  productId: string
  quantity?: number
}) {
  const {
    data: { user },
  } = await getUser()

  if (!user)
    throw new Error("NOT_AUTHENTICATED")

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

export async function updateQuantity(
  productId: string,
  quantity: number
) {
  const {
    data: { user },
  } = await getUser()

  if (!user) return []

  if (quantity <= 0)
    return removeItem(productId)

  await supabase
    .from("cart_items")
    .update({
      quantity,
    })
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

  await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id)
}
