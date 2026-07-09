"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCardLayout } from "@/components/auth/auth-card-layout"
import { PageLoader } from "@/components/ui/page-loader"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // شبیه‌سازی ارسال ایمیل (در پروژه واقعی باید API call شود)
    setTimeout(() => {
      setLoading(false)
      toast.success("لینک بازیابی برای شما ارسال شد (دمو)")
    }, 1500)
  }

  if (loading) {
    return <PageLoader isLoading={true} />
  }

  return (
    <AuthCardLayout
      title="بازیابی رمز عبور"
      subtitle="ایمیل خود را وارد کنید تا لینک بازیابی برای شما ارسال شود"
      footerText="رمز عبور خود را به خاطر دارید؟"
      footerLinkText="ورود"
      footerLinkHref="/auth/login"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-bold text-neutral-700">
            ایمیل
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-neutral-200 focus:border-green-400 focus:ring-green-200"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-green-600 text-white transition-colors hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "در حال ارسال..." : "ارسال لینک بازیابی"}
        </Button>
      </form>
    </AuthCardLayout>
  )
}
