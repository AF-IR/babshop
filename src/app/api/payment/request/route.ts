// مسیر: src/app/api/payment/request/route.ts
import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    // ---------- تست موقت: دریافت ۵ سفارش اول ----------
    const { data: orders, error } = await supabase
      .from("orders")
      .select("id, order_number, total, payment_status")
      .limit(5)

    console.log("📋 ORDERS found:", orders)
    console.log("❌ Supabase error:", error)

    // برگرداندن نتیجه به کلاینت برای بررسی
    return NextResponse.json({
      orders,
      error: error
        ? {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          }
        : null,
    })
  } catch (e) {
    console.error("💥 Internal Server Error:", e)
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: e instanceof Error ? e.message : String(e),
      },
      { status: 500 }
    )
  }
}
