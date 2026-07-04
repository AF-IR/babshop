"use client"

import {useState} from "react"

import StepAddress from "./step-address"

import StepShipping from "./step-shipping"

import StepPayment from "./step-payment"

import StepSuccess from "./step-success"

export default function CheckoutStepper(){

    const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
    return(

        <div className="mx-auto max-w-5xl">

            {step===1 && <StepAddress next={()=>setStep(2)}/>}

            {step===2 &&

                <StepShipping

                    next={()=>setStep(3)}

                    back={()=>setStep(1)}

                />

            }

            {step===3 &&

                <StepPayment

                    next={()=>setStep(4)}

                    back={()=>setStep(2)}

                />

            }

            {step===4 && <StepSuccess/>}

        </div>

    )

}
