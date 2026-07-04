export interface ShippingOption {
  id: string
  title: string
  price: number
  cod: boolean
  estimatedDays: string
}

export interface ShippingResult {
  available: ShippingOption[]
  defaultMethod: string
}

export function calculateShipping(itemCount: number): ShippingResult {
  const options: ShippingOption[] = []

  // اگر سه کالا یا کمتر باشد
  if (itemCount <= 3) {
    options.push({
      id: "post",
      title: "پست پیشتاز",
      price: 90000,
      cod: false,
      estimatedDays: "۳ تا ۵ روز کاری",
    })

    options.push({
      id: "tipax",
      title: "تیپاکس (پس کرایه)",
      price: 0,
      cod: true,
      estimatedDays: "۱ تا ۳ روز کاری",
    })
  } else {
    // بیشتر از سه کالا
    options.push({
      id: "tipax",
      title: "تیپاکس (پس کرایه)",
      price: 0,
      cod: true,
      estimatedDays: "۱ تا ۳ روز کاری",
    })
  }

  return {
    available: options,
    defaultMethod: options[0].id,
  }
}
