"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const menu = [
  {
    title: "داشبورد",
    href: "/admin",
  },
  {
    title: "محصولات",
    href: "/admin/products",
  },
  {
    title: "دسته‌بندی‌ها",
    href: "/admin/categories",
  },
  {
    title: "سفارش‌ها",
    href: "/admin/orders",
  },
  {
    title: "کاربران",
    href: "/admin/users",
  },
  {
    title: "تنظیمات",
    href: "/admin/settings",
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 bg-white border-l shadow-sm">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold">
          BabShop Admin
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          پنل مدیریت فروشگاه
        </p>
      </div>

      <nav className="p-4 space-y-2">
        {menu.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-4 py-3 transition

              ${
                active
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-100"
              }
              `}
            >
              {item.title}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
