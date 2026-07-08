"use client"

import { adminFetch }
from "../admin-api"

export async function getOrders(

page=1,

pageSize=20

){

return adminFetch(

`/api/admin/orders?page=${page}&pageSize=${pageSize}`

)

}

export async function getOrder(

id:string

){

return adminFetch(

`/api/admin/orders/${id}`

)

}

export async function updateOrderStatus(

id:string,

status:string

){

return adminFetch(

`/api/admin/orders/${id}`,

{

method:"PUT",

body:JSON.stringify({

status,

}),

}

)

}
