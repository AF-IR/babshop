src/app/(store)/checkout/page.tsx

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { loadCheckoutCart } from "@/lib/checkout/cart"
import { getAddresses } from "@/lib/addresses"

import { useUser } from "@/hooks/use-user"

import type { CheckoutCart } from "@/lib/checkout/cart"
import type { Address } from "@/types"

export default function CheckoutPage() {
  const router = useRouter()

  const { loading: userLoading, isAuthenticated } = useUser()

  const [loading, setLoading] = useState(true)

  const [cart, setCart] = useState<CheckoutCart | null>(null)

  const [addresses, setAddresses] = useState<Address[]>([])

  const [selectedAddress, setSelectedAddress] = useState("")

  // مراحل ویزارد
  const [step, setStep] = useState(1)
  const [shippingMethod, setShippingMethod] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("zarinpal")

  useEffect(() => {
    if (userLoading) return

    if (!isAuthenticated) {
      router.replace("/auth/login?redirect=/checkout")
      return
    }

    async function load() {
      try {
        const cartData = await loadCheckoutCart()
        setCart(cartData)

        const addressData = await getAddresses()
        setAddresses(addressData)

        const defaultAddress =
          addressData.find((a) => a.isDefault) ??
          addressData[0]

        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [userLoading, isAuthenticated, router])

  if (userLoading || loading) {
    return (
      <div className="container py-10">
        در حال بارگذاری...
      </div>
    )
  }

  if (!cart) {
    return (
      <div className="container py-10">
        سبد خرید شما خالی است.
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl py-10">

      <h1 className="text-3xl font-bold mb-8">
        تسویه حساب
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* ستون چپ */}
        <div className="lg:col-span-2">

          {/* مرحله ۱: انتخاب آدرس */}
          <Card>

            <CardHeader>

              <CardTitle>
                انتخاب آدرس
              </CardTitle>

            </CardHeader>

            <CardContent>

              {addresses.length === 0 ? (

                <div className="space-y-4">

                  <p className="text-muted-foreground">
                    هنوز هیچ آدرسی ثبت نکرده‌اید.
                  </p>

                  <Button
                    onClick={() =>
                      router.push("/account/addresses")
                    }
                  >
                    افزودن آدرس
                  </Button>

                </div>

              ) : (

                addresses.map((address) => (

                  <label
                    key={address.id}
                    className="flex items-start gap-3 border rounded-lg p-4 mb-3 cursor-pointer"
                  >

                    <input
                      type="radio"
                      checked={selectedAddress === address.id}
                      onChange={() =>
                        setSelectedAddress(address.id)
                      }
                    />

                    <div>

                      <div className="font-medium">
                        {address.firstName} {address.lastName}
                      </div>

                      <div>{address.line1}</div>

                      <div>{address.city}</div>

                    </div>

                  </label>

                ))

              )}

            </CardContent>

          </Card>

          {/* مرحله ۲: انتخاب روش ارسال */}
          {step >= 2 && (

            <Card className="mt-6">

              <CardHeader>

                <CardTitle>

                  انتخاب روش ارسال

                </CardTitle>

              </CardHeader>

              <CardContent className="space-y-3">

                <label className="flex items-center justify-between border rounded-lg p-4 cursor-pointer">

                  <div>

                    <p className="font-medium">

                      پست پیشتاز

                    </p>

                    <p className="text-sm text-muted-foreground">

                      ۲ تا ۴ روز کاری

                    </p>

                  </div>

                  <input
                    type="radio"
                    checked={shippingMethod === "post"}
                    onChange={() => setShippingMethod("post")}
                  />

                </label>

                <label className="flex items-center justify-between border rounded-lg p-4 cursor-pointer">

                  <div>

                    <p className="font-medium">

                      تیپاکس

                    </p>

                    <p className="text-sm text-muted-foreground">

                      ۱ تا ۲ روز کاری

                    </p>

                  </div>

                  <input
                    type="radio"
                    checked={shippingMethod === "tipax"}
                    onChange={() => setShippingMethod("tipax")}
                  />

                </label>

                <Button
                  className="w-full mt-4"
                  disabled={!shippingMethod}
                  onClick={() => setStep(3)}
                >

                  ادامه

                </Button>

              </CardContent>

            </Card>

          )}

          {/* مرحله ۳: روش پرداخت */}
          {step >= 3 && (

            <Card className="mt-6">

              <CardHeader>

                <CardTitle>

                  روش پرداخت

                </CardTitle>

              </CardHeader>

              <CardContent>

                <label className="flex items-center justify-between border rounded-lg p-4">

                  <div>

                    <p className="font-medium">

                      پرداخت اینترنتی زرین پال

                    </p>

                    <p className="text-sm text-muted-foreground">

                      پرداخت امن

                    </p>

                  </div>

                  <input
                    type="radio"
                    checked={paymentMethod === "zarinpal"}
                    onChange={() => setPaymentMethod("zarinpal")}
                  />

                </label>

              </CardContent>

            </Card>

          )}

        </div>

        {/* ستون راست: خلاصه سفارش */}
        <div>

          <Card>

            <CardHeader>

              <CardTitle>
                خلاصه سفارش
              </CardTitle>

            </CardHeader>

            <CardContent>

              <div className="flex justify-between">
                <span>جمع کالا</span>
                <span>{cart.subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between mt-3">
                <span>تعداد بسته</span>
                <span>{cart.totalBoxes}</span>
              </div>

              <div className="flex justify-between mt-3">
                <span>وزن</span>
                <span>{cart.totalWeight}</span>
              </div>

              <Button
                className="w-full mt-6"
                disabled={!selectedAddress}
                onClick={() => setStep(2)}
              >
                ادامه
              </Button>

            </CardContent>

          </Card>

        </div>

      </div>

    </div>
  )
}
