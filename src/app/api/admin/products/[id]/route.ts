import { NextRequest } from "next/server"

import {

  apiSuccess,

  apiException,

} from "@/lib/admin"

import {

  getProduct,

  updateProduct,

  deleteProduct,

} from "@/lib/admin/product"

//---------------------------------------
// GET
//---------------------------------------

export async function GET(

  request: NextRequest,

  {

    params,

  }: {

    params: Promise<{

      id: string

    }>

  }

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

//---------------------------------------
// PUT
//---------------------------------------

export async function PUT(

  request: NextRequest,

  {

    params,

  }: {

    params: Promise<{

      id: string

    }>

  }

) {

  try {

    const body =
      await request.json()

    const { id } =
      await params

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

//---------------------------------------
// DELETE
//---------------------------------------

export async function DELETE(

  request: NextRequest,

  {

    params,

  }: {

    params: Promise<{

      id: string

    }>

  }

) {

  try {

    const { id } =
      await params

    await deleteProduct(id)

    return apiSuccess(true)

  }

  catch (error) {

    return apiException(error)

  }

}
