import { NextRequest } from "next/server"

import {
  apiSuccess,
  apiError,
  apiException,
  requireAdmin,
} from "@/lib/admin"

import {
  getProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/admin/product"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)

    const { id } = await params

    const product = await getProduct(id)

    return apiSuccess(product)
  } catch (error) {
    return apiException(error)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)

    const { id } = await params

    const body = await request.json()

    const product = await updateProduct(id, body)

    return apiSuccess(product)
  } catch (error) {
    return apiException(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)

    const { id } = await params

    await deleteProduct(id)

    return apiSuccess({
      deleted: true,
    })
  } catch (error) {
    return apiException(error)
  }
}
