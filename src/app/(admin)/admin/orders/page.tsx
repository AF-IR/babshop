"use client"

import { useEffect, useState } from "react"

import Link from "next/link"

import { getOrders }

from "@/lib/admin/orders-client"

import {

AdminOrder,

}

from "@/types/admin-order"

export default function OrdersPage(){

const [

orders,

setOrders,

]=

useState<AdminOrder[]>([])

useEffect(()=>{

load()

},[])

async function load(){

const json=

await getOrders()

setOrders(

json.data.items

)

}

return(

<div className="space-y-6">

<h1 className="text-3xl font-bold">

مدیریت سفارشات

</h1>

<div className="rounded-lg border overflow-hidden">

<table className="w-full">

<thead className="bg-muted">

<tr>

<th className="p-3 text-right">

شماره

</th>

<th className="p-3 text-right">

مشتری

</th>

<th className="p-3 text-right">

مبلغ

</th>

<th className="p-3 text-right">

وضعیت

</th>

<th className="p-3 text-right">

تاریخ

</th>

<th className="p-3 text-right">

عملیات

</th>

</tr>

</thead>

<tbody>

{orders.map(order=>(

<tr

key={order.id}

className="border-t"

>

<td className="p-3">

{order.id.slice(0,8)}

</td>

<td className="p-3">

<div>

<div>

{order.customer_name}

</div>

<div className="text-sm text-muted-foreground">

{order.customer_email}

</div>

</div>

</td>

<td className="p-3">

{Number(order.total)

.toLocaleString()}

</td>

<td className="p-3">

{order.status}

</td>

<td className="p-3">

{

new Date(

order.created_at

)

.toLocaleDateString("fa-IR")

}

</td>

<td className="p-3">

<Link

href={`/admin/orders/${order.id}`}

className="rounded bg-blue-600 px-3 py-1 text-sm text-white"

>

مشاهده

</Link>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

)

}
