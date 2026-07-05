import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { requestPayment } from "@/lib/payment/zarinpal"

export async function POST(req: NextRequest) {
  try {
    //--------------------------------------------------
    // دریافت orderId از درخواست
    //--------------------------------------------------

    const { orderId } = await req.json()

    console.log("📦 orderId received:", orderId)

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      )
    }

    //--------------------------------------------------
    // پیدا کردن سفارش
    //--------------------------------------------------

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single()

    console.log("🔍 Order found:", order)
    console.log("❌ Supabase error:", error)

    // --------------------------------------------------
    // ✅ تغییر مهم: برگرداندن خطای کامل Supabase برای دیباگ
    // --------------------------------------------------

    if (error || !order) {
      console.error("Supabase error details:", {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
      })

      return NextResponse.json(
        {
          error: "Order not found",
          supabaseError: {
            message: error?.message || null,
            code: error?.code || null,
            details: error?.details || null,
            hint: error?.hint || null,
          },
          orderId,
        },
        { status: 404 }
      )
    }

    //--------------------------------------------------
    // جلوگیری از پرداخت مجدد
    //--------------------------------------------------

    if (order.payment_status === "paid") {
      return NextResponse.json(
        { error: "Order already paid" },
        { status: 400 }
      )
    }

    //--------------------------------------------------
    // مبلغ به تومان
    //--------------------------------------------------

    const amount = Math.round(order.total / 10)
    console.log("💰 Amount in Toman:", amount)

    //--------------------------------------------------
    // درخواست به زرین‌پال
    //--------------------------------------------------

    const payment = await requestPayment({
      amount,
      description: `سفارش ${order.order_number}`,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/zarinpal/callback`,
    })

    console.log("✅ Payment request successful, authority:", payment.authority)

    //--------------------------------------------------
    // ذخیره Authority در جدول payments
    //--------------------------------------------------

    const { error: paymentError } = await supabase
      .from("payments")
      .update({
        authority: payment.authority,
      })
      .eq("order_id", order.id)

    if (paymentError) {
      console.error("❌ Error updating payment authority:", paymentError)
    } else {
      console.log("✅ Authority saved successfully for order:", order.id)
    }

    //--------------------------------------------------
    // برگرداندن redirectUrl به کلاینت
    //--------------------------------------------------

    return NextResponse.json({
      redirectUrl: payment.url,
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
