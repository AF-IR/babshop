import { NextRequest, NextResponse } from "next/server"

// ✅ تغییر import به فایل موجود
import { supabase } from "@/lib/supabase"

import { verifyPayment } from "@/lib/payment/zarinpal"

export async function POST(req: NextRequest) {
  try {
    const { authority, status } = await req.json()

    if (!authority) {
      return NextResponse.json(
        { error: "Authority missing" },
        { status: 400 }
      )
    }

    // ❌ حذف: const supabase = createClient()

    //--------------------------------------------------
    // پیدا کردن پرداخت
    //--------------------------------------------------

    const { data: payment, error } = await supabase
      .from("payments")
      .select("*")
      .eq("authority", authority)
      .single()

    if (error || !payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      )
    }

    //--------------------------------------------------
    // قبلاً تایید شده؟
    //--------------------------------------------------

    if (payment.verified) {
      return NextResponse.json({
        success: true,
        orderId: payment.order_id,
      })
    }

    //--------------------------------------------------

    if (status !== "OK") {
      await supabase
        .from("payments")
        .update({
          status: "failed",
        })
        .eq("id", payment.id)

      return NextResponse.json(
        { error: "Payment cancelled" },
        { status: 400 }
      )
    }

    //--------------------------------------------------

    const amount = Math.round(payment.amount / 10)

    const result = await verifyPayment(
      authority,
      amount
    )

    //--------------------------------------------------
    // بروزرسانی payment
    //--------------------------------------------------

    await supabase
      .from("payments")
      .update({
        verified: true,
        status: "paid",
        ref_id: result.refId,
        card_pan: result.cardPan,
        paid_at: new Date().toISOString(),
        gateway_response: result,
      })
      .eq("id", payment.id)

    //--------------------------------------------------
    // بروزرسانی سفارش
    //--------------------------------------------------

    await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        status: "processing",
      })
      .eq("id", payment.order_id)

    //--------------------------------------------------

    return NextResponse.json({
      success: true,
      orderId: payment.order_id,
    })

  } catch (e) {

    console.error(e)

    return NextResponse.json(
      { error: "Verify failed" },
      { status: 500 }
    )
  }
}
