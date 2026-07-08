import { supabaseAdmin } from "@/lib/admin"

export async function getDashboardStats() {

  const [

    products,

    orders,

    users,

  ] = await Promise.all([

    supabaseAdmin
      .from("products")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabaseAdmin
      .from("orders")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabaseAdmin
      .from("profiles")
      .select("*", {
        count: "exact",
        head: true,
      }),

  ])

  return {

    totalProducts:
      products.count ?? 0,

    totalOrders:
      orders.count ?? 0,

    totalUsers:
      users.count ?? 0,

  }

}
