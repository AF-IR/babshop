import { NextRequest, NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

import { requestPayment } from "@/lib/payment/zarinpal"

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()

    //--------------------------------------------------
    // احراز هویت
    //--------------------------------------------------

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    //--------------------------------------------------
    // دریافت سفارش
    //--------------------------------------------------

    const { orderId } = await req.json()

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
      .eq("user_id", user.id)
      .single()

    if (error || !order) {
      return NextResponse.json(
        { error: "Order not found" },
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

    //--------------------------------------------------
    // درخواست زرین پال
    //--------------------------------------------------

    const payment = await requestPayment({
      amount,
      description: `سفارش ${order.order_number}`,
      callbackUrl:
        `${process.env.NEXT_PUBLIC_APP_URL}/payment/zarinpal/callback`,
    })

    //--------------------------------------------------
    // ذخیره Authority
    //--------------------------------------------------

    const { error: paymentError } = await supabase
      .from("payments")
      .update({
        authority: payment.authority,
      })
      .eq("order_id", order.id)

    if (paymentError) {
      console.error(paymentError)
    }

    //--------------------------------------------------

    return NextResponse.json({
      redirectUrl: payment.url,
    })
  } catch (e) {
    console.error(e)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
