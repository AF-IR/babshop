import ProductForm
from "@/components/admin/product-form"

export default function CreateProductPage(){

  return(

    <div className="space-y-8">

      <h1 className="text-3xl font-bold">

        افزودن محصول

      </h1>

      <ProductForm/>

    </div>

  )

}
