import { supabase } from "@/lib/supabase"

import { getUser } from "@/lib/auth"

export async function getAddresses(){

    const {

        data:{user}

    }=await getUser()

    if(!user) return []

    const {data,error}=await supabase

        .from("addresses")

        .select("*")

        .eq("user_id",user.id)

        .order("is_default",{

            ascending:false

        })

        .order("created_at")

    if(error){

        console.error(error)

        return []

    }

    return data

}

export async function getDefaultAddress(){

    const addresses=await getAddresses()

    if(addresses.length===0){

        return null

    }

    return addresses[0]

}

export async function deleteAddress(

    id:string

){

    const {

        error

    }=await supabase

        .from("addresses")

        .delete()

        .eq("id",id)

    if(error){

        throw error

    }

}

export async function setDefaultAddress(

    id:string

){

    const {

        data:{user}

    }=await getUser()

    if(!user){

        return

    }

    await supabase

        .from("addresses")

        .update({

            is_default:false

        })

        .eq(

            "user_id",

            user.id

        )

    await supabase

        .from("addresses")

        .update({

            is_default:true

        })

        .eq(

            "id",

            id

        )

}

export async function createAddress(

    values:any

){

    const {

        data:{user}

    }=await getUser()

    if(!user){

        throw new Error("No User")

    }

    const {

        data,

        error

    }=await supabase

        .from("addresses")

        .insert({

            ...values,

            user_id:user.id

        })

        .select()

        .single()

    if(error){

        throw error

    }

    return data

}
