import { supabase } from "@/lib/supabase"

export async function createOrder(
  addressId: string,
  shippingMethodId: string
) {
  // ۱. کاربر فعلی
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("کاربر وارد نشده است.")
  }

  // ۲. آدرس
  const { data: address, error: addressError } = await supabase
    .from("addresses")
    .select("*")
    .eq("id", addressId)
    .single()

  if (addressError || !address) {
    throw new Error("آدرس پیدا نشد.")
  }

  // ۳. روش ارسال
  const { data: shipping, error: shippingError } = await supabase
    .from("shipping_methods")
    .select("*")
    .eq("id", shippingMethodId)
    .single()

  if (shippingError || !shipping) {
    throw new Error("روش ارسال پیدا نشد.")
  }

  // ۴. دریافت آیتم‌های سبد خرید
  const { data: cartItems, error: cartError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", user.id)

  if (cartError) throw cartError

  if (!cartItems || cartItems.length === 0) {
    throw new Error("سبد خرید خالی است.")
  }

  // ۵. دریافت اطلاعات محصولات
  const productIds = cartItems.map((i) => i.product_id)

  const { data: products, error: productsError } = await supabase
    .from("products") // همان products که گفتی
    .select("*")
    .in("id", productIds)

  if (productsError) throw productsError

  // ۶. چک موجودی (نکته شماره ۷ شما)
  for (const item of cartItems) {
    const product = products?.find((p) => p.id === item.product_id)
    if (!product) {
      throw new Error(`محصول با شناسه ${item.product_id} یافت نشد.`)
    }
    if (product.stock < item.quantity) {
      throw new Error(`موجودی محصول "${product.title}" کافی نیست.`)
    }
  }

  // ۷. محاسبه مبلغ
  let subtotal = 0

  for (const item of cartItems) {
    const product = products!.find((p) => p.id === item.product_id)
    if (!product) continue // برای امنیت بیشتر
    subtotal += product.price * item.quantity
  }

  const shippingPrice = shipping.price
  const total = subtotal + shippingPrice

  // ۸. شماره سفارش (فعلاً همان ORD-... ولی بعداً اصلاح می‌کنیم)
  const orderNumber = "ORD-" + Date.now().toString()

  // ۹. ساخت سفارش
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      address_id: address.id,
      status: "pending",
      payment_status: "pending",
      shipping_method: shipping.code,
      shipping_title: shipping.title,
      shipping_price: shippingPrice,
      subtotal,
      discount: 0,
      total,
      receiver_name: address.first_name + " " + address.last_name,
      receiver_phone: address.phone,
      address_text: address.line1,
      city: address.city,
      province: address.state,
      postal_code: address.postal_code,
      payment_method: "zarinpal",
    })
    .select()
    .single()

  if (orderError) throw orderError

  // ۱۰. ساخت آیتم‌های سفارش (با مدیریت null و حذف !)
  const orderItems = cartItems
    .map((item) => {
      const product = products?.find((p) => p.id === item.product_id)
      if (!product) return null // اگر محصول وجود نداشت، رد می‌شود

      return {
        order_id: order.id,
        product_id: product.id,
        quantity: item.quantity,
        unit_price: product.price,
        total_price: product.price * item.quantity,
        product_title: product.title,
        product_slug: product.slug,
        product_image: product.image,
      }
    })
    .filter(Boolean) // حذف آیتم‌های null

  if (orderItems.length === 0) {
    throw new Error("هیچ آیتم معتبری برای ثبت سفارش وجود ندارد.")
  }

  const { error: orderItemsError } = await supabase
    .from("order_items")
    .insert(orderItems)

  if (orderItemsError) throw orderItemsError

  // ۱۱. ساخت رکورد پرداخت
  const { error: paymentError } = await supabase
    .from("payments")
    .insert({
      user_id: user.id,
      order_id: order.id,
      gateway: "zarinpal",
      amount: total,
      status: "pending",
    })

  if (paymentError) throw paymentError

  // ۱۲. برگرداندن سفارش (برای استفاده در مرحله بعد)
  return order
}
