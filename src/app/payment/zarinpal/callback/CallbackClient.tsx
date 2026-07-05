"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CallbackClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")
  const [message, setMessage] = useState("")
  const [refId, setRefId] = useState("")

  useEffect(() => {
    const authority = searchParams.get("Authority")
    const statusParam = searchParams.get("Status") // OK یا NOK

    if (!authority) {
      setStatus("failed")
      setMessage("اطلاعات پرداخت نامعتبر است.")
      return
    }

    async function verify() {
      try {
        const response = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            authority,
            status: statusParam,
          }),
        })

        const data = await response.json()

        if (data.success) {
          setStatus("success")
          setRefId(data.refId || "")
          setMessage("پرداخت شما با موفقیت انجام شد.")
        } else {
          setStatus("failed")
          setMessage(data.error || data.message || "پرداخت ناموفق بود.")
        }
      } catch (error) {
        setStatus("failed")
        setMessage("خطا در ارتباط با سرور.")
      }
    }

    verify()
  }, [searchParams])

  if (status === "loading") {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold">در حال تأیید پرداخت...</h2>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto py-20">
      <Card>
        <CardHeader>
          <CardTitle className={status === "success" ? "text-green-600" : "text-red-600"}>
            {status === "success" ? "✅ پرداخت موفق" : "❌ پرداخت ناموفق"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{message}</p>
          {refId && (
            <p className="text-sm text-muted-foreground">
              کد پیگیری: {refId}
            </p>
          )}
          <Button
            className="w-full"
            onClick={() => router.push(status === "success" ? "/account/orders" : "/checkout")}
          >
            {status === "success" ? "مشاهده سفارشات" : "بازگشت به تسویه حساب"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
