"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

type VerifyResponse = {
  success?: boolean
  orderId?: string
  error?: string
}

export default function ZarinpalCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState("در حال بررسی پرداخت...")

  useEffect(() => {
    async function verify() {
      const authority = searchParams.get("Authority")
      const status = searchParams.get("Status")

      if (!authority) {
        setLoading(false)
        setSuccess(false)
        setMessage("شناسه پرداخت معتبر نیست.")
        return
      }

      try {
        const res = await fetch("/api/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            authority,
            status,
          }),
        })

        const data: VerifyResponse = await res.json()

        if (!res.ok || !data.success) {
          setSuccess(false)
          setMessage(data.error || "پرداخت ناموفق بود.")
        } else {
          setSuccess(true)
          setMessage("پرداخت با موفقیت انجام شد.")
        }
      } catch (err) {
        console.error(err)
        setSuccess(false)
        setMessage("خطا در ارتباط با سرور.")
      } finally {
        setLoading(false)
      }
    }

    verify()
  }, [searchParams])

  return (
    <div className="container mx-auto max-w-lg py-20">
      <div className="rounded-xl border p-8 shadow-sm bg-white text-center">

        {loading ? (
          <>
            <h1 className="text-2xl font-bold mb-4">
              در حال بررسی پرداخت...
            </h1>

            <p className="text-gray-600">
              لطفاً چند لحظه صبر کنید.
            </p>
          </>
        ) : success ? (
          <>
            <h1 className="text-3xl font-bold text-green-600 mb-4">
              ✅ پرداخت موفق
            </h1>

            <p className="mb-8">
              {message}
            </p>

            <button
              onClick={() => router.push("/account/orders")}
              className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
            >
              مشاهده سفارش‌ها
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              ❌ پرداخت ناموفق
            </h1>

            <p className="mb-8">
              {message}
            </p>

            <button
              onClick={() => router.push("/checkout")}
              className="rounded-lg bg-gray-900 px-6 py-3 text-white hover:bg-black"
            >
              بازگشت به تسویه حساب
            </button>
          </>
        )}
      </div>
    </div>
  )
}
