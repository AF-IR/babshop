import { supabase } from "@/lib/supabase"

export async function createOrder(order: any) {
  const { data, error } = await supabase
    .from("orders")
    .insert(order)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createOrderItems(items: any[]) {
  const { error } = await supabase.from("order_items").insert(items)
  if (error) throw error
}

export async function createPayment(payment: any) {
  const { data, error } = await supabase
    .from("payments")
    .insert(payment)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePayment(paymentId: string, values: any) {
  const { error } = await supabase
    .from("payments")
    .update(values)
    .eq("id", paymentId)

  if (error) throw error
}

export async function updateOrder(orderId: string, values: any) {
  const { error } = await supabase
    .from("orders")
    .update(values)
    .eq("id", orderId)

  if (error) throw error
}
