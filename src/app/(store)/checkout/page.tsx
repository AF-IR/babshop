"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { loadCheckoutCart } from "@/lib/checkout/cart"
import { getAddresses } from "@/lib/addresses"
// import { getShippingMethods } from "@/lib/shipping"   // بعداً اضافه می‌شود

import { useUser } from "@/hooks/use-user"

import type { CheckoutCart } from "@/lib/checkout/cart"
import type { Address } from "@/types"

// نوع موقت برای روش ارسال (بعداً از دیتابیس خوانده می‌شود)
type ShippingMethod = {
  id: string
  name: string
  description: string
  delivery_time: string
  price: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const { loading: userLoading, isAuthenticated } = useUser()

  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CheckoutCart | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])

  // داده‌های آزمایشی روش ارسال (تا زمان اتصال به دیتابیس)
  const [shippingMethods] = useState<ShippingMethod[]>([
    {
      id: "post",
      name: "پست پیشتاز",
      description: "ارسال با پست",
      delivery_time: "۲ تا ۴ روز کاری",
      price: 59000,
    },
    {
      id: "tipax",
      name: "تیپاکس",
      description: "ارسال با تیپاکس",
      delivery_time: "۱ تا ۲ روز کاری",
      price: 89000,
    },
  ])

  // انتخاب‌های کاربر
  const [selectedAddressId, setSelectedAddressId] = useState("")
  const [selectedShippingId, setSelectedShippingId] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"zarinpal" | "wallet">("zarinpal")

  // مرحله ویزارد (۱ تا ۳)
  const [step, setStep] = useState(1)

  // محاسبه هزینه ارسال
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
        const [cartData, addressData] = await Promise.all([
          loadCheckoutCart(),
          getAddresses(),
          // getShippingMethods(), // بعداً اضافه می‌شود
        ])

        setCart(cartData)
        setAddresses(addressData)

        const defaultAddress = addressData.find((a) => a.isDefault) ?? addressData[0]
        if (defaultAddress) setSelectedAddressId(defaultAddress.id)

        // انتخاب پیش‌فرض اولین روش ارسال
        if (shippingMethods.length > 0) setSelectedShippingId(shippingMethods[0].id)
      } catch (error) {
        console.error("خطا در بارگذاری اطلاعات:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [userLoading, isAuthenticated, router, shippingMethods])

  if (userLoading || loading) {
    return <div className="container py-10 text-center">در حال بارگذاری اطلاعات...</div>
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-10 text-center">
        <h2 className="text-2xl font-bold">سبد خرید شما خالی است</h2>
        <Button className="mt-4" onClick={() => router.push("/")}>
          بازگشت به فروشگاه
        </Button>
      </div>
    )
  }

  // تابع پرداخت (موقت)
  const handlePayment = () => {
    alert(`پرداخت با روش ${paymentMethod} به مبلغ ${total.toLocaleString()} ریال`)
    // در آینده: ثبت سفارش و اتصال به درگاه
  }

  return (
    <div className="container mx-auto max-w-6xl py-10">
      <h1 className="text-3xl font-bold mb-8">تسویه حساب</h1>

      {/* استپر ساده (جایگزین کامپوننت حذف‌شده) */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                s === step
                  ? "bg-primary text-primary-foreground"
                  : s < step
                  ? "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-16 h-0.5 mx-2 ${s < step ? "bg-green-500" : "bg-muted"}`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ستون اصلی */}
        <div className="lg:col-span-2 space-y-6">
          {/* مرحله ۱: آدرس */}
          <Card className={step !== 1 ? "opacity-60" : ""}>
            <CardHeader>
              <CardTitle>انتخاب آدرس تحویل</CardTitle>
            </CardHeader>
            <CardContent>
              {addresses.length === 0 ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground">هیچ آدرسی ثبت نشده است.</p>
                  <Button onClick={() => router.push("/account/addresses")}>
                    افزودن آدرس جدید
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`flex items-start gap-3 border rounded-lg p-4 cursor-pointer transition ${
                        selectedAddressId === address.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium">
                          {address.firstName} {address.lastName}
                        </div>
                        <div className="text-sm">{address.line1}</div>
                        <div className="text-sm">{address.city}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              {step === 1 && (
                <Button
                  className="w-full mt-6"
                  disabled={!selectedAddressId}
                  onClick={() => setStep(2)}
                >
                  ادامه
                </Button>
              )}
            </CardContent>
          </Card>

          {/* مرحله ۲: روش ارسال */}
          <Card className={step !== 2 ? "opacity-60" : ""}>
            <CardHeader>
              <CardTitle>روش ارسال</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {shippingMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition ${
                    selectedShippingId === method.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div>
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {method.description} - {method.delivery_time}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">
                      {method.price.toLocaleString()} ریال
                    </span>
                    <input
                      type="radio"
                      name="shipping"
                      checked={selectedShippingId === method.id}
                      onChange={() => setSelectedShippingId(method.id)}
                    />
                  </div>
                </label>
              ))}
              {step === 2 && (
                <Button
                  className="w-full mt-4"
                  disabled={!selectedShippingId}
                  onClick={() => setStep(3)}
                >
                  ادامه
                </Button>
              )}
            </CardContent>
          </Card>

          {/* مرحله ۳: روش پرداخت */}
          <Card className={step !== 3 ? "opacity-60" : ""}>
            <CardHeader>
              <CardTitle>روش پرداخت</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <label
                  className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition ${
                    paymentMethod === "zarinpal"
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div>
                    <p className="font-medium">زرین‌پال</p>
                    <p className="text-sm text-muted-foreground">پرداخت اینترنتی امن</p>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "zarinpal"}
                    onChange={() => setPaymentMethod("zarinpal")}
                  />
                </label>

                <label
                  className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition ${
                    paymentMethod === "wallet"
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div>
                    <p className="font-medium">کیف پول</p>
                    <p className="text-sm text-muted-foreground">استفاده از اعتبار موجود</p>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "wallet"}
                    onChange={() => setPaymentMethod("wallet")}
                  />
                </label>
              </div>
              {step === 3 && (
                <Button className="w-full mt-6" onClick={handlePayment}>
                  پرداخت نهایی
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ستون خلاصه سفارش */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>خلاصه سفارش</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>جمع کالا</span>
                <span>{cart.subtotal.toLocaleString()} ریال</span>
              </div>
              <div className="flex justify-between">
                <span>تعداد بسته</span>
                <span>{cart.totalBoxes}</span>
              </div>
              <div className="flex justify-between">
                <span>وزن کل</span>
                <span>{cart.totalWeight} گرم</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold">
                <span>هزینه ارسال</span>
                <span>{shippingCost.toLocaleString()} ریال</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-primary">
                <span>مبلغ قابل پرداخت</span>
                <span>{total.toLocaleString()} ریال</span>
              </div>
              <Button
                className="w-full mt-4"
                onClick={() => setStep(3)}
                disabled={step === 3}
              >
                پرداخت
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
