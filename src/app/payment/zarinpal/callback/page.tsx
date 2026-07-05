"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function ZarinpalCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const authority = searchParams.get("Authority")
    const status = searchParams.get("Status")

    if (!authority) {
      router.replace("/checkout?payment=invalid")
      return
    }

    async function verify() {
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

        const json = await res.json()

        if (res.ok) {
          router.replace(`/account/orders/${json.orderId}`)
        } else {
          router.replace("/checkout?payment=failed")
        }
      } catch {
        router.replace("/checkout?payment=failed")
      }
    }

    verify()
  }, [router, searchParams])

  return (
    <div className="container py-20 text-center">
      <h2 className="text-2xl font-bold">
        در حال بررسی پرداخت...
      </h2>

      <p className="mt-4 text-muted-foreground">
        لطفاً این صفحه را نبندید.
      </p>
    </div>
  )
}
