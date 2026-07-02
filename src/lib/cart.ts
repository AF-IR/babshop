import { supabase } from "@/lib/supabase"
import { productRepository } from "@/lib/repositories"

import type {
  CartItem,
  ProductImage,
} from "@/types"

interface CartRow {
  id: string
  user_id: string
  product_id: string
  variant_id: string
  quantity: number
}

async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

async function buildCartItem(
  row: CartRow
): Promise<CartItem | null> {
  const product = await productRepository.getById(
    row.product_id
  )

  if (!product) return null

  const variant =
    product.variants.find(
      (v) => v.id === row.variant_id
    ) ?? product.variants[0]

  if (!variant) return null

  const image: ProductImage =
    product.images[0] ?? {
      url: "",
      alt: product.name,
    }

  return {
    id: row.id,

    variantId: variant.id,

    productId: product.id,

    name: product.name,

    variantName: variant.name,

    image,

    slug: product.slug,

    price: variant.price,

    quantity: row.quantity,

    lineTotal: variant.price * row.quantity,
  }
}

// ============================================================
// Public API
// ============================================================

export async function getCart(): Promise<CartItem[]> {
  const user = await getCurrentUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", user.id)

  if (error) {
    console.error(error)
    return []
  }

  const items = await Promise.all(
    (data ?? []).map((row) => buildCartItem(row as CartRow))
  )

  return items.filter(
    (item): item is CartItem => item !== null
  )
}

export async function addItem(params: {
  variantId: string
  productId: string
  quantity?: number
}) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("User not logged in")
  }

  const quantity = params.quantity ?? 1

  const { data: existing } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", user.id)
    .eq("variant_id", params.variantId)
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
        variant_id: params.variantId,
        quantity,
      })
  }

  return getCart()
}

// ============================================================
// Remove item
// ============================================================

export async function removeItem(
  variantId: string
): Promise<CartItem[]> {
  const user = await getCurrentUser()

  if (!user) {
    return []
  }

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id)
    .eq("variant_id", variantId)

  if (error) {
    console.error(error)
  }

  return getCart()
}

// ============================================================
// Update quantity
// ============================================================

export async function updateQuantity(
  variantId: string,
  quantity: number
): Promise<CartItem[]> {
  const user = await getCurrentUser()

  if (!user) {
    return []
  }

  if (quantity <= 0) {
    return removeItem(variantId)
  }

  const { error } = await supabase
    .from("cart_items")
    .update({
      quantity,
    })
    .eq("user_id", user.id)
    .eq("variant_id", variantId)

  if (error) {
    console.error(error)
  }

  return getCart()
}

// ============================================================
// Clear cart
// ============================================================

export async function clearCart(): Promise<void> {
  const user = await getCurrentUser()

  if (!user) return

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id)

  if (error) {
    console.error(error)
  }
}

// ============================================================
// Merge guest cart after login
// ============================================================

export async function mergeGuestCart(
  guestItems: CartItem[]
): Promise<CartItem[]> {
  const user = await getCurrentUser()

  if (!user) {
    return guestItems
  }

  for (const item of guestItems) {
    await addItem({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
    })
  }

  return getCart()
}
