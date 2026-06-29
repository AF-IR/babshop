import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function testConnection() {
  const { data, error } = await supabase
    .from("products_v2")
    .select("*")
    .limit(1)

  if (error) {
    console.error(error)
    return []
  }

  return data
}
