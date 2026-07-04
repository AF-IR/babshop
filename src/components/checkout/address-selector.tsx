"use client"

import { useEffect,useState } from "react"

import {

    getAddresses

} from "@/lib/addresses"

import {

    useCheckoutStore

} from "@/store/checkout"

import AddressSkeleton from "./address-skeleton"

import AddressEmpty from "./address-empty"

import AddressCard from "./address-card"

export default function AddressSelector(){

    const[loading,setLoading]=useState(true)

    const[addresses,setAddresses]=useState<any[]>([])

    const{

        selectedAddress,

        setAddress

    }=useCheckoutStore()

    useEffect(()=>{

        async function load(){

            const list=await getAddresses()

            setAddresses(list)

            if(

                list.length &&

                !selectedAddress

            ){

                setAddress(list[0])

            }

            setLoading(false)

        }

        load()

    },[])

    if(loading){

        return <AddressSkeleton/>

    }

    if(addresses.length===0){

        return <AddressEmpty/>

    }

    return(

        <div className="space-y-4">

            {

                addresses.map(address=>(

                    <AddressCard

                        key={address.id}

                        address={address}

                        selected={

                            selectedAddress?.id===address.id

                        }

                        onSelect={()=>setAddress(address)}

                    />

                ))

            }

        </div>

    )

}
