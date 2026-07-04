"use client"

interface StepShippingProps {
  next: () => void
  back: () => void
}

export default function StepShipping({
  next,
  back,
}: StepShippingProps) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <h2 className="mb-6 text-xl font-bold">
        روش ارسال
      </h2>

      <div className="space-y-4">

        <label className="flex cursor-pointer items-center justify-between rounded-lg border p-4">

          <div>
            <p className="font-semibold">
              پست پیشتاز
            </p>

            <p className="text-sm text-gray-500">
              مناسب سفارش‌های کم حجم
            </p>

          </div>

          <input
            type="radio"
            name="shipping"
            defaultChecked
          />

        </label>

        <label className="flex cursor-pointer items-center justify-between rounded-lg border p-4">

          <div>

            <p className="font-semibold">
              تیپاکس
            </p>

            <p className="text-sm text-gray-500">
              پس کرایه
            </p>

          </div>

          <input
            type="radio"
            name="shipping"
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
          ادامه
        </button>

      </div>

    </div>
  )
}
