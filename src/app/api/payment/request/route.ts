import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"  // ← استفاده از کلید سرویس
import { requestPayment } from "@/lib/payment/zarinpal"

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json()

    console.log("📦 orderId received:", orderId)

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      )
    }

    // پیدا کردن سفارش با supabaseAdmin (دور می‌زند RLS)
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single()

    console.log("🔍 Order found:", order)
    console.log("❌ Supabase error:", error)

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

    if (order.payment_status === "paid") {
      return NextResponse.json(
        { error: "Order already paid" },
        { status: 400 }
      )
    }

    const amount = Math.round(order.total / 10)
    console.log("💰 Amount in Toman:", amount)

    const payment = await requestPayment({
      amount,
      description: `سفارش ${order.order_number}`,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/zarinpal/callback`,
    })

    console.log("✅ Payment request successful, authority:", payment.authority)

    const { error: paymentError } = await supabaseAdmin
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
