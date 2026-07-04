"use client"

import Link from "next/link"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function AddressEmpty() {

    return (

        <div className="rounded-2xl border border-dashed p-12 text-center">

            <h2 className="text-lg font-semibold">

                هنوز آدرسی ثبت نکرده‌اید

            </h2>

            <p className="mt-3 text-muted-foreground">

                برای ادامه خرید ابتدا یک آدرس ثبت کنید.

            </p>

            <Button

                asChild

                className="mt-8"

            >

                <Link

                    href="/account/addresses"

                >

                    <Plus className="mr-2 h-4 w-4"/>

                    افزودن آدرس

                </Link>

            </Button>

        </div>

    )

}
