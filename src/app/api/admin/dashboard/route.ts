import {
  apiException,
  apiSuccess,
  supabaseAdmin,
} from "@/lib/admin"

export async function GET() {
  try {
    //--------------------------------------------------
    // محصولات
    //--------------------------------------------------

    const { count: products } = await supabaseAdmin
      .from("products")
      .select("*", {
        count: "exact",
        head: true,
      })

    //--------------------------------------------------
    // سفارش ها
    //--------------------------------------------------

    const { count: orders } = await supabaseAdmin
      .from("orders")
      .select("*", {
        count: "exact",
        head: true,
      })

    //--------------------------------------------------
    // کاربران
    //--------------------------------------------------

    const {
      data: { users },
    } = await supabaseAdmin.auth.admin.listUsers()

    //--------------------------------------------------
    // دسته بندی ها
    //--------------------------------------------------

    const { count: categories } = await supabaseAdmin
      .from("categories")
      .select("*", {
        count: "exact",
        head: true,
      })

    //--------------------------------------------------
    // سفارش های در انتظار
    //--------------------------------------------------

    const { count: pendingOrders } = await supabaseAdmin
      .from("orders")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "pending")

    //--------------------------------------------------
    // سفارش های ارسال شده
    //--------------------------------------------------

    const { count: shippedOrders } = await supabaseAdmin
      .from("orders")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "shipped")

    //--------------------------------------------------
    // فروش کل
    //--------------------------------------------------

    const { data: sales } = await supabaseAdmin
      .from("orders")
      .select("total")
      .eq("payment_status", "paid")

    const totalSales =
      sales?.reduce(
        (sum, item) => sum + Number(item.total),
        0
      ) ?? 0

    //--------------------------------------------------

    return apiSuccess({
      products: products ?? 0,
      orders: orders ?? 0,
      users: users.length,
      categories: categories ?? 0,
      pendingOrders: pendingOrders ?? 0,
      shippedOrders: shippedOrders ?? 0,
      totalSales,
    })
  } catch (error) {
    return apiException(error)
  }
}
