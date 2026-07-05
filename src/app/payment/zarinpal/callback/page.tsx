import { Suspense } from "react"
import CallbackClient from "./CallbackClient"

export default function Page() {
  return (
    <Suspense fallback={<div className="container py-20 text-center">در حال بارگذاری...</div>}>
      <CallbackClient />
    </Suspense>
  )
}
