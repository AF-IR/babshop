"use client"

import { CheckCircle2 } from "lucide-react"

interface Props{

    address:any

    selected:boolean

    onSelect():void

}

export default function AddressCard({

    address,

    selected,

    onSelect

}:Props){

    return(

        <button

            type="button"

            onClick={onSelect}

            className={`

                w-full

                rounded-xl

                border

                p-5

                text-right

                transition

                ${selected

                    ? "border-primary bg-primary/5"

                    : "hover:border-primary/40"

                }

            `}

        >

            <div className="flex items-center justify-between">

                <span className="font-semibold">

                    {address.first_name}

                    {" "}

                    {address.last_name}

                </span>

                {

                    selected && (

                        <CheckCircle2

                            className="h-5 w-5 text-primary"

                        />

                    )

                }

            </div>

            <div className="mt-3 text-sm text-muted-foreground">

                {address.line1}

            </div>

            {

                address.line2 && (

                    <div className="text-sm text-muted-foreground">

                        {address.line2}

                    </div>

                )

            }

            <div className="mt-2 text-sm">

                {address.city}

                {" - "}

                {address.state}

            </div>

            <div className="text-sm">

                {address.postal_code}

            </div>

        </button>

    )

}
