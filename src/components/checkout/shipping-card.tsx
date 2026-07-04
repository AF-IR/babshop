"use client"

import { CheckCircle2 } from "lucide-react"

interface ShippingCardProps {

  shipping: any

  selected: boolean

  onSelect(): void

}

export default function ShippingCard({

  shipping,

  selected,

  onSelect

}: ShippingCardProps) {

  return (

    <button

      type="button"

      onClick={onSelect}

      className={`

        w-full

        rounded-xl

        border

        p-5

        text-right

        transition

        ${selected

          ? "border-primary bg-primary/5"

          : "hover:border-primary/40"}

      `}

    >

      <div className="flex items-center justify-between">

        <div>

          <div className="font-semibold">

            {shipping.title}

          </div>

          <div className="text-sm text-muted-foreground">

            {shipping.description}

          </div>

        </div>

        {

          selected &&

          <CheckCircle2

            className="h-5 w-5 text-primary"

          />

        }

      </div>

      <div className="mt-4 font-bold">

        {

          shipping.price === 0

            ? "پس کرایه"

            : `${shipping.price.toLocaleString()} تومان`

        }

      </div>

    </button>

  )

}
