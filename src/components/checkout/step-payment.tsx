"use client"

import PaymentSelector from "./payment-selector"

export default function StepPayment() {
  return (
    <div className="space-y-6">

      <div>

        <h2 className="text-xl font-bold">
          پرداخت
        </h2>

        <p className="mt-2 text-muted-foreground">
          روش پرداخت خود را انتخاب کنید.
        </p>

      </div>

      <PaymentSelector />

    </div>
  )
}
