import { supabase } from "@/lib/supabase"
import { getUser } from "@/lib/auth"

export interface CheckoutCartItem {

  productId: string

  title: string

  image: string

  quantity: number

  unitPrice: number

  totalPrice: number

  weight: number

  boxCount: number

}

export interface CheckoutCart {

  items: CheckoutCartItem[]

  subtotal: number

  totalBoxes: number

  totalWeight: number

}

export async function loadCheckoutCart(): Promise<CheckoutCart> {

  const {
    data: { user },
  } = await getUser()

  if (!user)
    throw new Error("NOT_AUTHENTICATED")

  const { data, error } = await supabase

    .from("cart_items")

    .select(`
      quantity,

      product_id,

      products(
        title,
        image,
        price,
        weight,
        box_count
      )
    `)

    .eq("user_id", user.id)

  if (error)
    throw error

  if (!data?.length)
    throw new Error("EMPTY_CART")

  const items: CheckoutCartItem[] = data.map((row: any) => ({

    productId: row.product_id,

    title: row.products.title,

    image: row.products.image,

    quantity: row.quantity,

    unitPrice: row.products.price,

    totalPrice:
      row.products.price * row.quantity,

    weight:
      (row.products.weight ?? 0) *
      row.quantity,

    boxCount:
      (row.products.box_count ?? 1) *
      row.quantity,

  }))

  return {

    items,

    subtotal: items.reduce(

      (s, i) => s + i.totalPrice,

      0

    ),

    totalBoxes: items.reduce(

      (s, i) => s + i.boxCount,

      0

    ),

    totalWeight: items.reduce(

      (s, i) => s + i.weight,

      0

    ),

  }

}
