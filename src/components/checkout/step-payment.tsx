"use client"

interface StepPaymentProps {
  next: () => void
  back: () => void
}

export default function StepPayment({
  next,
  back,
}: StepPaymentProps) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <h2 className="mb-6 text-xl font-bold">
        پرداخت
      </h2>

      <div className="space-y-4">

        <label className="flex items-center justify-between rounded-lg border p-4">

          <div>

            <p className="font-semibold">
              زرین پال
            </p>

            <p className="text-sm text-gray-500">
              پرداخت آنلاین
            </p>

          </div>

          <input
            type="radio"
            defaultChecked
            name="payment"
          />

        </label>

      </div>

      <div className="mt-8 flex justify-between">

        <button
          onClick={back}
          className="rounded-lg border px-5 py-2"
        >
          قبلی
        </button>

        <button
          onClick={next}
          className="rounded-lg bg-black px-6 py-2 text-white"
        >
          ثبت سفارش
        </button>

      </div>

    </div>
  )
}
