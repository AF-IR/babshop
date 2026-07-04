"use client"

import { CheckCircle2 } from "lucide-react"

import { useCheckoutStore } from "@/store/checkout"

const METHODS = [

  {

    id: "zarinpal",

    title: "زرین پال",

    description: "پرداخت آنلاین"

  }

]

export default function PaymentSelector() {

  const {

    paymentMethod,

    setPaymentMethod

  } = useCheckoutStore()

  return (

    <div className="space-y-4">

      {

        METHODS.map(method=>(

          <button

            key={method.id}

            type="button"

            onClick={()=>setPaymentMethod(method)}

            className={`

              w-full

              rounded-xl

              border

              p-5

              text-right

              transition

              ${paymentMethod?.id===method.id

                ? "border-primary bg-primary/5"

                : "hover:border-primary/40"

              }

            `}

          >

            <div className="flex items-center justify-between">

              <div>

                <div className="font-semibold">

                  {method.title}

                </div>

                <div className="text-sm text-muted-foreground">

                  {method.description}

                </div>

              </div>

              {

                paymentMethod?.id===method.id &&

                <CheckCircle2 className="h-5 w-5 text-primary"/>

              }

            </div>

          </button>

        ))

      }

    </div>

  )

}
