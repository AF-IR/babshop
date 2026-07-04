"use client"

import ShippingSelector from "./shipping-selector"

export default function StepShipping() {
  return (
    <div className="space-y-6">

      <div>

        <h2 className="text-xl font-bold">
          روش ارسال
        </h2>

        <p className="mt-2 text-muted-foreground">
          روش ارسال سفارش خود را انتخاب کنید.
        </p>

      </div>

      <ShippingSelector />

    </div>
  )
}
