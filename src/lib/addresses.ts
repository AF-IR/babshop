import { supabase } from "@/lib/supabase"
import type { Address } from "@/types"

export async function getAddresses() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw error

  return (data ?? []).map((address) => ({
    id: address.id,
    type: address.type,
    firstName: address.first_name,
    lastName: address.last_name,
    line1: address.line1,
    line2: address.line2 ?? undefined,
    city: address.city,
    state: address.state,
    postalCode: address.postal_code,
    country: address.country,
    isDefault: address.is_default,
  })) as Address[]
}

export async function addAddress(address: Omit<Address, "id">) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase.from("addresses").insert({
    user_id: user.id,
    type: address.type,
    first_name: address.firstName,
    last_name: address.lastName,
    line1: address.line1,
    line2: address.line2,
    city: address.city,
    state: address.state,
    postal_code: address.postalCode,
    country: address.country,
    is_default: address.isDefault,
  })

  if (error) throw error
}

export async function removeAddress(id: string) {
  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", id)

  if (error) throw error
}
