import { supabase } from "@/lib/supabase"
import { getUser } from "@/lib/auth"

export async function getAddresses() {
  const {
    data: { user },
  } = await getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at")

  if (error) {
    console.error(error)
    return []
  }

  // تبدیل به camelCase برای استفاده در کامپوننت‌ها
  return (data ?? []).map((a) => ({
    id: a.id,
    firstName: a.first_name,
    lastName: a.last_name,
    line1: a.line1,
    line2: a.line2,
    city: a.city,
    state: a.state,
    postalCode: a.postal_code,
    country: a.country,
    isDefault: a.is_default,
  }))
}

export async function getDefaultAddress() {
  const addresses = await getAddresses()
  return addresses.length > 0 ? addresses[0] : null
}

export async function deleteAddress(id: string) {
  const { error } = await supabase.from("addresses").delete().eq("id", id)
  if (error) throw error
}

export async function setDefaultAddress(id: string) {
  const {
    data: { user },
  } = await getUser()
  if (!user) return

  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", user.id)

  await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", id)
}

export async function createAddress(values: any) {
  const {
    data: { user },
  } = await getUser()
  if (!user) throw new Error("No User")

  const { data, error } = await supabase
    .from("addresses")
    .insert({ ...values, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

// ===== Compatibility =====
export async function addAddress(values: any) {
  return createAddress(values)
}
export async function removeAddress(id: string) {
  return deleteAddress(id)
}
