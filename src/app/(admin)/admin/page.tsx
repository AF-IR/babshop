"use client"

import { useEffect, useState } from "react"

import Link from "next/link"

import {

getDashboard,

} from "@/lib/admin/dashboard-client"

export default function AdminDashboard(){

const [

stats,

setStats,

]=useState<any>(null)

useEffect(()=>{

load()

},[])

async function load(){

const json=

await getDashboard()

setStats(json.data)

}

if(!stats){

return(

<div>

در حال بارگذاری...

</div>

)

}

return(

<div className="space-y-8">

<h1 className="text-3xl font-bold">

داشبورد مدیریت

</h1>

<div className="grid gap-6 md:grid-cols-3">

<Card

title="محصولات"

value={stats.totalProducts}

color="bg-blue-600"

/>

<Card

title="سفارشات"

value={stats.totalOrders}

color="bg-green-600"

/>

<Card

title="کاربران"

value={stats.totalUsers}

color="bg-purple-600"

/>

</div>

<div className="grid gap-5 md:grid-cols-2">

<Link

href="/admin/products"

className="rounded-lg border p-6 hover:bg-muted"

>

مدیریت محصولات

</Link>

<Link

href="/admin/orders"

className="rounded-lg border p-6 hover:bg-muted"

>

مدیریت سفارشات

</Link>

<Link

href="/admin/categories"

className="rounded-lg border p-6 hover:bg-muted"

>

مدیریت دسته بندی

</Link>

<Link

href="/admin/brands"

className="rounded-lg border p-6 hover:bg-muted"

>

مدیریت برندها

</Link>

</div>

</div>

)

}

function Card({

title,

value,

color,

}:{

title:string

value:number

color:string

}){

return(

<div

className={`${color} rounded-xl p-6 text-white`}

>

<div className="text-lg">

{title}

</div>

<div className="mt-4 text-5xl font-bold">

{value}

</div>

</div>

)

}
