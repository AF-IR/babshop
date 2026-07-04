"use client"

import AddressSelector from "./address-selector"

export default function StepAddress() {

    return (

        <div className="space-y-6">

            <div>

                <h2 className="text-xl font-bold">

                    انتخاب آدرس

                </h2>

                <p className="text-muted-foreground mt-2">

                    لطفاً آدرس تحویل سفارش را انتخاب کنید.

                </p>

            </div>

            <AddressSelector/>

        </div>

    )

}
