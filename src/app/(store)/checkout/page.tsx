"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Truck, CreditCard, Wallet, ShoppingBag, Check, ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageLoader } from "@/components/ui/page-loader"

import { loadCheckoutCart } from "@/lib/checkout/cart"
import { getAddresses } from "@/lib/addresses"
import { getShippingMethods, type ShippingMethod } from "@/lib/shipping"
import { createOrder } from "@/lib/orders/create-order"
import { formatPrice } from "@/lib/utils"

import { useUser } from "@/hooks/use-user"

import type { CheckoutCart } from "@/lib/checkout/cart"
import type { Address } from "@/types"

export default function CheckoutPage() {
  const router = useRouter()
  const { loading: userLoading, isAuthenticated } = useUser()

  const [loading, setLoading] = useState(true)
  const [creatingOrder, setCreatingOrder] = useState(false)
  const [cart, setCart] = useState<CheckoutCart | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])

  const [selectedAddressId, setSelectedAddressId] = useState("")
  const [selectedShippingId, setSelectedShippingId] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"zarinpal" | "wallet">("zarinpal")
  const [step, setStep] = useState(1)

  const selectedShipping = shippingMethods.find((m) => m.id === selectedShippingId)
  const shippingCost = selectedShipping?.price || 0
  const total = cart ? cart.subtotal + shippingCost : 0

  useEffect(() => {
    if (userLoading) return
    if (!isAuthenticated) {
      router.replace("/auth/login?redirect=/checkout")
      return
    }

    async function loadData() {
      try {
        const [cartData, addressData, shippingData] = await Promise.all([
          loadCheckoutCart(),
          getAddresses(),
          getShippingMethods(),
        ])

        setCart(cartData)
        setAddresses(addressData)
        setShippingMethods(shippingData)

        const defaultAddress = addressData.find((a) => a.isDefault) ?? addressData[0]
        if (defaultAddress) setSelectedAddressId(defaultAddress.id)

        if (shippingData.length > 0) {
          setSelectedShippingId(shippingData[0].id)
        }
      } catch (error) {
        console.error("خطا در بارگذاری اطلاعات:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [userLoading, isAuthenticated, router])

  const handlePayment = async () => {
    if (!selectedAddressId) {
      alert("لطفا آدرس را انتخاب کنید.")
      return
    }

    if (!selectedShippingId) {
      alert("لطفا روش ارسال را انتخاب کنید.")
      return
    }

    try {
      setCreatingOrder(true)

      const order = await createOrder(selectedAddressId, selectedShippingId)

      const response = await fetch("/api/payment/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "خطا در ایجاد پرداخت")
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
      } else {
        throw new Error("آدرس پرداخت دریافت نشد.")
      }
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : "ثبت سفارش با خطا مواجه شد.")
    } finally {
      setCreatingOrder(false)
    }
  }

  // نمایش لودر
  if (userLoading || loading) {
    return <PageLoader isLoading={true} />
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto max-w-6xl py-20 text-center font-[family-name:var(--font-vazir)]">
        <ShoppingBag className="mx-auto h-20 w-20 text-neutral-300" />
        <h2 className="mt-4 text-2xl font-bold text-neutral-800">سبد خرید شما خالی است</h2>
        <p className="mt-2 text-neutral-500">برای ادامه خرید، به فروشگاه بازگردید.</p>
        <Button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8" onClick={() => router.push("/")}>
          بازگشت به فروشگاه
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4 sm:py-10 font-[family-name:var(--font-vazir)]">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-800">تسویه حساب</h1>
        <Badge className="bg-green-600 text-white text-sm px-3 py-1">
          {cart.items.length} کالا
        </Badge>
      </div>

      {/* ===== استپ‌های مراحل ===== */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
        {[
          { id: 1, label: "آدرس", icon: MapPin },
          { id: 2, label: "ارسال", icon: Truck },
          { id: 3, label: "پرداخت", icon: CreditCard },
        ].map((s, index) => (
          <div key={s.id} className="flex items-center">
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                s.id === step
                  ? "bg-green-600 text-white shadow-lg shadow-green-200"
                  : s.id < step
                  ? "bg-green-500 text-white"
                  : "bg-neutral-100 text-neutral-400"
              }`}
            >
              {s.id < step ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs">
                  {s.id}
                </span>
              )}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {index < 2 && (
              <div
                className={`h-0.5 w-8 sm:w-16 ${
                  s.id < step ? "bg-green-500" : "bg-neutral-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* ===== ستون اصلی ===== */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* مرحله ۱: آدرس */}
          <Card className={`border-2 transition-all ${
            step === 1 ? "border-green-200 shadow-lg shadow-green-50" : "border-neutral-100"
          }`}>
            <CardHeader className="bg-gradient-to-r from-green-50 to-white rounded-t-xl">
              <CardTitle className="flex items-center gap-2 text-lg text-neutral-800">
                <MapPin className="h-5 w-5 text-green-600" />
                انتخاب آدرس تحویل
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {addresses.length === 0 ? (
                <div className="space-y-4 text-center py-6">
                  <p className="text-neutral-500">هیچ آدرسی ثبت نشده است.</p>
                  <Button onClick={() => router.push("/account/addresses")} className="bg-green-600 hover:bg-green-700 text-white">
                    افزودن آدرس جدید
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`flex items-start gap-3 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        selectedAddressId === address.id
                          ? "border-green-500 bg-green-50 shadow-sm"
                          : "border-neutral-200 hover:border-green-200 hover:bg-neutral-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                        className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-neutral-800">
                          {address.firstName} {address.lastName}
                          {address.isDefault && (
                            <Badge className="mr-2 bg-green-500 text-white text-xs">پیش‌فرض</Badge>
                          )}
                        </div>
                        <div className="text-sm text-neutral-600">{address.line1}</div>
                        <div className="text-sm text-neutral-500">{address.city}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              {step === 1 && (
                <Button
                  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white text-base py-6"
                  disabled={!selectedAddressId}
                  onClick={() => setStep(2)}
                >
                  ادامه <ChevronLeft className="mr-2 h-5 w-5" />
                </Button>
              )}
            </CardContent>
          </Card>

          {/* مرحله ۲: روش ارسال */}
          <Card className={`border-2 transition-all ${
            step === 2 ? "border-green-200 shadow-lg shadow-green-50" : "border-neutral-100"
          }`}>
            <CardHeader className="bg-gradient-to-r from-green-50 to-white rounded-t-xl">
              <CardTitle className="flex items-center gap-2 text-lg text-neutral-800">
                <Truck className="h-5 w-5 text-green-600" />
                روش ارسال
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {shippingMethods.length === 0 ? (
                <p className="text-neutral-500 text-center py-6">هیچ روش ارسالی فعال نیست.</p>
              ) : (
                <div className="space-y-3">
                  {shippingMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        selectedShippingId === method.id
                          ? "border-green-500 bg-green-50 shadow-sm"
                          : "border-neutral-200 hover:border-green-200 hover:bg-neutral-50"
                      }`}
                    >
                      <div>
                        <p className="font-bold text-neutral-800">{method.title}</p>
                        <p className="text-sm text-neutral-500">
                          {method.description ?? "ارسال استاندارد"}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-green-700 text-lg">
                          {method.price.toLocaleString()} تومان
                        </span>
                        <input
                          type="radio"
                          name="shipping"
                          checked={selectedShippingId === method.id}
                          onChange={() => setSelectedShippingId(method.id)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500"
                        />
                      </div>
                    </label>
                  ))}
                </div>
              )}
              {step === 2 && (
                <Button
                  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white text-base py-6"
                  disabled={!selectedShippingId}
                  onClick={() => setStep(3)}
                >
                  ادامه <ChevronLeft className="mr-2 h-5 w-5" />
                </Button>
              )}
            </CardContent>
          </Card>

          {/* مرحله ۳: روش پرداخت */}
          <Card className={`border-2 transition-all ${
            step === 3 ? "border-green-200 shadow-lg shadow-green-50" : "border-neutral-100"
          }`}>
            <CardHeader className="bg-gradient-to-r from-green-50 to-white rounded-t-xl">
              <CardTitle className="flex items-center gap-2 text-lg text-neutral-800">
                <CreditCard className="h-5 w-5 text-green-600" />
                روش پرداخت
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <label
                  className={`flex items-center justify-between border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === "zarinpal"
                      ? "border-green-500 bg-green-50 shadow-sm"
                      : "border-neutral-200 hover:border-green-200 hover:bg-neutral-50"
                  }`}
                >
                  <div>
                    <p className="font-bold text-neutral-800">زرین‌پال</p>
                    <p className="text-sm text-neutral-500">پرداخت اینترنتی امن و سریع</p>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "zarinpal"}
                    onChange={() => setPaymentMethod("zarinpal")}
                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                  />
                </label>

                <label
                  className={`flex items-center justify-between border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === "wallet"
                      ? "border-green-500 bg-green-50 shadow-sm"
                      : "border-neutral-200 hover:border-green-200 hover:bg-neutral-50"
                  }`}
                >
                  <div>
                    <p className="font-bold text-neutral-800">کیف پول</p>
                    <p className="text-sm text-neutral-500">استفاده از اعتبار موجود در حساب</p>
                  </div>
                  <Wallet className="h-5 w-5 text-neutral-400" />
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "wallet"}
                    onChange={() => setPaymentMethod("wallet")}
                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                  />
                </label>
              </div>
              {step === 3 && (
                <Button
                  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white text-base py-6 text-lg"
                  disabled={creatingOrder}
                  onClick={handlePayment}
                >
                  {creatingOrder ? (
                    <>
                      <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></span>
                      در حال ثبت سفارش...
                    </>
                  ) : (
                    <>
                      پرداخت نهایی
                      <ChevronLeft className="mr-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ===== ستون خلاصه سفارش ===== */}
        <div>
          <Card className="sticky top-24 border-2 border-neutral-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-neutral-50 to-white rounded-t-xl">
              <CardTitle className="flex items-center gap-2 text-lg text-neutral-800">
                <ShoppingBag className="h-5 w-5 text-green-600" />
                خلاصه سفارش
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex justify-between text-base">
                <span className="text-neutral-600">جمع کالاها</span>
                <span className="font-bold text-neutral-800">{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-500">
                <span>تعداد بسته‌ها</span>
                <span>{cart.totalBoxes} عدد</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-500">
                <span>وزن کل</span>
                <span>{cart.totalWeight} گرم</span>
              </div>
              <hr className="border-dashed" />
              <div className="flex justify-between text-base">
                <span className="text-neutral-600">هزینه ارسال</span>
                <span className="font-bold text-green-700">{formatPrice(shippingCost)}</span>
              </div>
              <hr className="border-2 border-green-200" />
              <div className="flex justify-between text-xl font-extrabold">
                <span className="text-neutral-800">مبلغ قابل پرداخت</span>
                <span className="text-green-700">{formatPrice(total)}</span>
              </div>
              <Button
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white text-base py-6"
                onClick={() => setStep(3)}
                disabled={step === 3}
              >
                {step === 3 ? "در مرحله پرداخت هستید" : "پرداخت"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
