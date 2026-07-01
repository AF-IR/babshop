import { supabase } from "@/lib/supabase"
import type { Address } from "@/types"

/**
 * دریافت تمام آدرس‌های کاربر جاری
 */
export async function getAddresses(): Promise<Address[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching addresses:", error)
    throw new Error("Failed to fetch addresses")
  }

  // تبدیل رکوردهای دیتابیس به نوع Address
  return (data || []).map((row) => ({
    id: row.id,
    type: row.type,
    firstName: row.first_name,
    lastName: row.last_name,
    line1: row.line1,
    line2: row.line2 || undefined,
    city: row.city,
    state: row.state,
    postalCode: row.postal_code,
    country: row.country,
    isDefault: row.is_default,
  }))
}

/**
 * افزودن آدرس جدید برای کاربر جاری
 */
export async function addAddress(
  addressData: Omit<Address, "id">
): Promise<Address> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      user_id: user.id,
      type: addressData.type,
      first_name: addressData.firstName,
      last_name: addressData.lastName,
      line1: addressData.line1,
      line2: addressData.line2 || null,
      city: addressData.city,
      state: addressData.state,
      postal_code: addressData.postalCode,
      country: addressData.country,
      is_default: addressData.isDefault ?? false,
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding address:", error)
    throw new Error("Failed to add address")
  }

  return {
    id: data.id,
    type: data.type,
    firstName: data.first_name,
    lastName: data.last_name,
    line1: data.line1,
    line2: data.line2 || undefined,
    city: data.city,
    state: data.state,
    postalCode: data.postal_code,
    country: data.country,
    isDefault: data.is_default,
  }
}

/**
 * حذف آدرس با شناسه مشخص (فقط در صورتی که متعلق به کاربر جاری باشد)
 */
export async function removeAddress(id: string): Promise<void> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("User not authenticated")
  }

  // ابتدا بررسی می‌کنیم که آدرس متعلق به کاربر است
  const { data: address, error: fetchError } = await supabase
    .from("addresses")
    .select("user_id")
    .eq("id", id)
    .single()

  if (fetchError || !address) {
    throw new Error("Address not found")
  }

  if (address.user_id !== user.id) {
    throw new Error("You don't have permission to delete this address")
  }

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error removing address:", error)
    throw new Error("Failed to remove address")
  }
}
