import { NextRequest } from "next/server"

import {
  apiSuccess,
  apiException,
} from "@/lib/admin"

import {
  getProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/admin/products"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params

    const product =
      await getProduct(id)

    return apiSuccess(product)

  }

  catch (error) {

    return apiException(error)

  }

}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params

    const body =
      await request.json()

    const product =
      await updateProduct(
        id,
        body
      )

    return apiSuccess(product)

  }

  catch (error) {

    return apiException(error)

  }

}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params

    await deleteProduct(id)

    return apiSuccess({
      success: true,
    })

  }

  catch (error) {

    return apiException(error)

  }

}
