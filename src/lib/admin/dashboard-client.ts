"use client"

import { adminFetch }

from "../admin-api"

export async function getDashboard(){

return adminFetch(

"/api/admin/dashboard"

)

}
