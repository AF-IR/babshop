import { supabase } from "@/lib/supabase"

export async function getFavorites(): Promise<string[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("favorites")
    .select("product_id")
    .eq("user_id", user.id)

  if (error) {
    console.error(error)
    return []
  }

  return data.map((item) => item.product_id)
}

export async function addFavorite(productId: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase
    .from("favorites")
    .insert({
      user_id: user.id,
      product_id: productId,
    })

  if (error) throw error
}

export async function removeFavorite(productId: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("product_id", productId)

  if (error) throw error
}

export async function isFavorite(productId: string): Promise<boolean> {
  const favorites = await getFavorites()
  return favorites.includes(productId)
}
