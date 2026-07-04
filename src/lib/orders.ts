import { supabase } from "@/lib/supabase"
import { getUser } from "@/lib/auth"

export async function createOrder(data: {
  addressId: string
  shippingMethod: string
  shippingTitle: string
  shippingPrice: number
  subtotal: number
  total: number
  paymentMethod: string
  notes?: string
}) {
  const {
    data: { user },
  } = await getUser()

  if (!user) {
    throw new Error("NOT_AUTHENTICATED")
  }

  const orderNumber =
    "BB-" +
    Date.now().toString()

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      address_id: data.addressId,
      status: "pending",
      payment_status: "pending",
      shipping_method: data.shippingMethod,
      shipping_title: data.shippingTitle,
      shipping_price: data.shippingPrice,
      subtotal: data.subtotal,
      discount: 0,
      total: data.total,
      payment_method: data.paymentMethod,
      notes: data.notes ?? "",
    })
    .select()
    .single()

  if (error) throw error

  return order
}
