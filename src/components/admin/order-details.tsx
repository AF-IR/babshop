"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import {
  getOrder,
  updateOrderStatus,
} from "@/lib/admin/orders-client"

export default function OrderDetails() {

  const params = useParams()

  const id = params.id as string

  const [order, setOrder] = useState<any>(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    load()

  }, [])

  async function load() {

    const json =
      await getOrder(id)

    setOrder(json.data)

    setLoading(false)

  }

  async function changeStatus(

    status: string

  ) {

    await updateOrderStatus(

      id,

      status

    )

    await load()

  }

  if (loading) {

    return <div>در حال بارگذاری...</div>

  }

  return (

    <div className="space-y-8">

      <h1 className="text-3xl font-bold">

        سفارش

      </h1>

      <div className="rounded-lg border p-6 space-y-3">

        <div>

          <b>شناسه:</b>

          {" "}

          {order.id}

        </div>

        <div>

          <b>مشتری:</b>

          {" "}

          {order.customer_name}

        </div>

        <div>

          <b>ایمیل:</b>

          {" "}

          {order.customer_email}

        </div>

        <div>

          <b>وضعیت:</b>

          {" "}

          {order.status}

        </div>

        <div>

          <b>مبلغ:</b>

          {" "}

          {Number(order.total)

            .toLocaleString()}

        </div>

      </div>

      <div className="flex flex-wrap gap-3">

        <button

          onClick={()=>

            changeStatus("pending")

          }

          className="rounded bg-gray-700 px-4 py-2 text-white"

        >

          در انتظار

        </button>

        <button

          onClick={()=>

            changeStatus("paid")

          }

          className="rounded bg-green-700 px-4 py-2 text-white"

        >

          پرداخت شده

        </button>

        <button

          onClick={()=>

            changeStatus("processing")

          }

          className="rounded bg-blue-700 px-4 py-2 text-white"

        >

          آماده سازی

        </button>

        <button

          onClick={()=>

            changeStatus("shipped")

          }

          className="rounded bg-purple-700 px-4 py-2 text-white"

        >

          ارسال شد

        </button>

        <button

          onClick={()=>

            changeStatus("delivered")

          }

          className="rounded bg-emerald-700 px-4 py-2 text-white"

        >

          تحویل شد

        </button>

        <button

          onClick={()=>

            changeStatus("cancelled")

          }

          className="rounded bg-red-700 px-4 py-2 text-white"

        >

          لغو شد

        </button>

      </div>

    </div>

  )

}
