import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "حساب کاربری | ارزان پلاست",
    template: "%s | ارزان پلاست",
  },
  description: "ورود، ثبت‌نام و مدیریت حساب کاربری در ارزان پلاست",
  robots: { index: false, follow: false },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children
}
