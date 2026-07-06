async function getDashboard() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/dashboard`,
    {
      cache: "no-store",
    }
  )

  if (!res.ok) {
    throw new Error("Dashboard Error")
  }

  return res.json()
}

export default async function AdminPage() {
  const result = await getDashboard()

  const data = result.data

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        داشبورد مدیریت
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

        <Card
          title="محصولات"
          value={data.products}
        />

        <Card
          title="سفارش‌ها"
          value={data.orders}
        />

        <Card
          title="کاربران"
          value={data.users}
        />

        <Card
          title="دسته‌بندی‌ها"
          value={data.categories}
        />

      </div>
    </div>
  )
}

function Card({
  title,
  value,
}: {
  title: string
  value: number
}) {
  return (
    <div className="rounded-xl bg-white shadow p-6">
      <div className="text-gray-500">
        {title}
      </div>

      <div className="text-4xl font-bold mt-3">
        {value}
      </div>
    </div>
  )
}
