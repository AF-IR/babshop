// src/app/api/payment/request/route.ts

import { NextRequest, NextResponse } from "next/server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { requestPayment } from "@/lib/payment/zarinpal"

export async function POST(req: NextRequest) {
  try {
    //--------------------------------------------------
    // دریافت orderId
    //--------------------------------------------------

    const { orderId } = await req.json()

    console.log("📦 orderId:", orderId)

    if (!orderId) {
      return NextResponse.json(
        {
          error: "orderId is required",
        },
        {
          status: 400,
        }
      )
    }

    //--------------------------------------------------
    // دریافت سفارش
    //--------------------------------------------------

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single()

    console.log("📄 Order:", order)
    console.log("❌ Order Error:", orderError)

    if (orderError || !order) {
      return NextResponse.json(
        {
          error: "Order not found",
          details: orderError,
        },
        {
          status: 404,
        }
      )
    }

    //--------------------------------------------------
    // اگر قبلاً پرداخت شده
    //--------------------------------------------------

    if (order.payment_status === "paid") {
      return NextResponse.json(
        {
          error: "Order already paid",
        },
        {
          status: 400,
        }
      )
    }

    //--------------------------------------------------
    // مبلغ (زرین پال = تومان)
    //--------------------------------------------------

    const amount = Math.round(order.total / 10)

    console.log("💰 Amount:", amount)

    //--------------------------------------------------
    // درخواست پرداخت
    //--------------------------------------------------

    const payment = await requestPayment({
      amount,
      description: `سفارش ${order.order_number}`,
      callbackUrl:
        `${process.env.NEXT_PUBLIC_APP_URL}/payment/zarinpal/callback`,
    })

    console.log("✅ Payment:", payment)

    //--------------------------------------------------
    // ذخیره Authority
    //--------------------------------------------------

    const { error: paymentUpdateError } = await supabaseAdmin
      .from("payments")
      .update({
        authority: payment.authority,
      })
      .eq("order_id", order.id)

    if (paymentUpdateError) {
      console.error(
        "❌ Payment Update Error:",
        paymentUpdateError
      )
    }

    //--------------------------------------------------
    // برگرداندن لینک پرداخت
    //--------------------------------------------------

    return NextResponse.json({
      success: true,
      redirectUrl: payment.url,
    })
  } catch (error) {
    console.error("💥 Payment API Error:", error)

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      {
        status: 500,
      }
    )
  }
}
