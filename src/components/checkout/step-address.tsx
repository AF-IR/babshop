"use client"

import AddressSelector from "./address-selector"

interface StepAddressProps {
  next: () => void
}

export default function StepAddress({
  next,
}: StepAddressProps) {
  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-xl font-bold">
          انتخاب آدرس
        </h2>

        <p className="mt-2 text-muted-foreground">
          آدرس دریافت سفارش را انتخاب کنید.
        </p>
      </div>

      <AddressSelector />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={next}
          className="rounded-lg bg-primary px-6 py-3 text-primary-foreground"
        >
          ادامه
        </button>
      </div>

    </div>
  )
}
