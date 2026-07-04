import { supabase } from "@/lib/supabase"
import { getUser } from "@/lib/auth"

export async function createOrder(data: {
  addressId: string
  shippingMethod: string
  shippingTitle: string
  shippingPrice: number
  paymentMethod: string
}) {
  const {
    data: { user },
  } = await getUser()

  if (!user) {
    throw new Error("NOT_AUTHENTICATED")
  }

  // cart
  const { data: cart } = await supabase
    .from("cart_items")
    .select(`
      *,
      products (
        title,
        price,
        image
      )
    `)
    .eq("user_id", user.id)

  if (!cart || cart.length === 0) {
    throw new Error("EMPTY_CART")
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.products.price,
    0
  )

  const total = subtotal + data.shippingPrice

  // address
  const { data: address } = await supabase
    .from("addresses")
    .select("*")
    .eq("id", data.addressId)
    .single()

  if (!address) {
    throw new Error("ADDRESS_NOT_FOUND")
  }

  // order
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,

      address_id: address.id,

      receiver_name:
        address.first_name + " " + address.last_name,

      receiver_phone: "",

      address_text: address.line1,

      city: address.city,

      province: address.state,

      postal_code: address.postal_code,

      shipping_method: data.shippingMethod,

      shipping_title: data.shippingTitle,

      shipping_price: data.shippingPrice,

      subtotal,

      total,

      payment_method: data.paymentMethod,
    })
    .select()
    .single()

  if (error) throw error

  // order items
  const items = cart.map((item) => ({
    order_id: order.id,

    product_id: item.product_id,

    product_title: item.products.title,

    image: item.products.image,

    quantity: item.quantity,

    unit_price: item.products.price,

    total_price:
      item.quantity * item.products.price,
  }))

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(items)

  if (itemsError) throw itemsError

  return order
}
