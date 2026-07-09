import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface AuthCardLayoutProps {
  title: string
  subtitle: string
  footerText: string
  footerLinkText: string
  footerLinkHref: string
  children: React.ReactNode
}

export function AuthCardLayout({
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkHref,
  children,
}: AuthCardLayoutProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-16 font-[family-name:var(--font-vazir)]">
      <Card className="w-full border-2 border-green-100 shadow-xl shadow-green-50/50 transition-all hover:shadow-green-100/70">
        <CardHeader className="space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-800">
            {title}
          </h1>
          <p className="text-sm text-neutral-500">{subtitle}</p>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <Separator className="bg-green-100" />
        <CardFooter className="justify-center pt-6">
          <p className="text-sm text-neutral-500">
            {footerText}{" "}
            <Link
              href={footerLinkHref}
              className="font-medium text-green-600 transition-colors hover:text-green-700 hover:underline"
            >
              {footerLinkText}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
