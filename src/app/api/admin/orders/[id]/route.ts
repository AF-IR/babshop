import { NextRequest } from "next/server"

import {

  apiSuccess,

  apiException,

} from "@/lib/admin"

import {

  getOrder,

  updateOrderStatus,

} from "@/lib/admin/orders"

//--------------------------------------------------

export async function GET(

request:NextRequest,

{

params,

}:{

params:Promise<{

id:string

}>

}

){

try{

const{

id,

}=await params

const order=

await getOrder(id)

return apiSuccess(order)

}

catch(error){

return apiException(error)

}

}

//--------------------------------------------------

export async function PUT(

request:NextRequest,

{

params,

}:{

params:Promise<{

id:string

}>

}

){

try{

const{

id,

}=await params

const body=

await request.json()

const order=

await updateOrderStatus(

id,

body.status

)

return apiSuccess(order)

}

catch(error){

return apiException(error)

}

}
