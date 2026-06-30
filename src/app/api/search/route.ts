import { NextRequest, NextResponse } from "next/server"
import { productRepository } from "@/lib/repositories"

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? ""

  if (!q.trim()) {
    return NextResponse.json([])
  }

  const { items } = await productRepository.search(q, {
    page: 1,
    limit: 6,
  })

  return NextResponse.json(items)
}
