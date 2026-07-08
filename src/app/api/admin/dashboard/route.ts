import {

apiSuccess,

apiException,

} from "@/lib/admin"

import {

getDashboardStats,

} from "@/lib/admin/dashboard"

export async function GET(){

try{

const data=

await getDashboardStats()

return apiSuccess(data)

}

catch(error){

return apiException(error)

}

}
