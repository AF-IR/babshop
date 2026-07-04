"use client"

import ShippingCard from "./shipping-card"

import { useCheckoutStore } from "@/store/checkout"

const METHODS = [

  {

    id: "post",

    title: "پست پیشتاز",

    description: "تحویل ۳ تا ۵ روز کاری",

    price: 89000

  },

  {

    id: "tipax",

    title: "تیپاکس",

    description: "هزینه هنگام تحویل دریافت می‌شود",

    price: 0

  }

]

export default function ShippingSelector() {

  const {

    shippingMethod,

    setShippingMethod

  } = useCheckoutStore()

  return (

    <div className="space-y-4">

      {

        METHODS.map(method => (

          <ShippingCard

            key={method.id}

            shipping={method}

            selected={shippingMethod?.id === method.id}

            onSelect={() => setShippingMethod(method)}

          />

        ))

      }

    </div>

  )

}
