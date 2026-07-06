// ============================================================
// src/lib/payment/zarinpal.ts
// ارتباط با درگاه زرین‌پال (نسخه ۴ API) - نسخه نهایی
// ============================================================

const ZARINPAL_API = "https://sandbox.zarinpal.com/pg/v4/payment"
const START_PAY_URL = "https://sandbox.zarinpal.com/pg/StartPay"
// ✅ پیشنهاد ۱: بررسی وجود Merchant ID در زمان اجرا
const MERCHANT_ID = "11111111-1111-1111-1111-111111111111"
export interface PaymentRequestInput {
  amount: number // تومان
  description: string
  callbackUrl: string
  mobile?: string
  email?: string
}

export interface PaymentRequestResult {
  authority: string
  url: string
}

export interface VerifyResult {
  refId: number
  cardHash?: string
  cardPan?: string
}

// ============================================================
// ۱. درخواست پرداخت جدید
// ============================================================

export async function requestPayment(
  input: PaymentRequestInput
): Promise<PaymentRequestResult> {
  // ✅ بررسی Merchant ID
  if (!MERCHANT_ID) {
    throw new Error("ZARINPAL_MERCHANT_ID در متغیرهای محیطی تنظیم نشده است.")
  }

  // ✅ ساخت metadata بدون داده‌های ساختگی (پیشنهاد ۱)
  const metadata: Record<string, string> = {}
  if (input.mobile) metadata.mobile = input.mobile
  if (input.email) metadata.email = input.email

  const payload = {
    merchant_id: MERCHANT_ID,
    amount: input.amount,
    callback_url: input.callbackUrl,
    description: input.description,
    metadata,
  }

  try {
    const res = await fetch(`${ZARINPAL_API}/request.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })

    // ✅ بررسی وضعیت HTTP (پیشنهاد ۲)
    if (!res.ok) {
      throw new Error(`خطا در ارتباط با زرین‌پال (HTTP ${res.status})`)
    }

    // ✅ مدیریت خطای JSON (پیشنهاد ۳)
    let json
    try {
      json = await res.json()
    } catch {
      throw new Error("پاسخ نامعتبر از زرین‌پال دریافت شد.")
    }

    if (json.data?.code !== 100) {
      const errorMessage =
        json.errors?.message ||
        json.data?.message ||
        `خطا در ایجاد درخواست پرداخت (کد: ${json.data?.code || "نامشخص"})`
      throw new Error(errorMessage)
    }

    // ✅ استفاده از START_PAY_URL (پیشنهاد ۲)
    return {
      authority: json.data.authority,
      url: `${START_PAY_URL}/${json.data.authority}`,
    }
  } catch (error) {
    // اگر خطا از نوع Error نبود، یک خطای جدید بساز
    if (error instanceof Error) {
      throw error
    }
    throw new Error("خطای ناشناخته در درخواست پرداخت.")
  }
}

// ============================================================
// ۲. تأیید پرداخت (Verify)
// ============================================================

export async function verifyPayment(
  authority: string,
  amount: number
): Promise<VerifyResult> {
  // ✅ بررسی Merchant ID
  if (!MERCHANT_ID) {
    throw new Error("ZARINPAL_MERCHANT_ID در متغیرهای محیطی تنظیم نشده است.")
  }

  const payload = {
    merchant_id: MERCHANT_ID,
    authority,
    amount,
  }

  try {
    const res = await fetch(`${ZARINPAL_API}/verify.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })

    // ✅ بررسی وضعیت HTTP
    if (!res.ok) {
      throw new Error(`خطا در ارتباط با زرین‌پال (HTTP ${res.status})`)
    }

    // ✅ مدیریت خطای JSON
    let json
    try {
      json = await res.json()
    } catch {
      throw new Error("پاسخ نامعتبر از زرین‌پال دریافت شد.")
    }

    // ✅ کد ۱۰۰ = موفق، کد ۱۰۱ = قبلاً تأیید شده (پیشنهاد ۶)
    if (json.data?.code !== 100 && json.data?.code !== 101) {
      const errorMessage =
        json.errors?.message ||
        json.data?.message ||
        `پرداخت تأیید نشد (کد: ${json.data?.code || "نامشخص"})`
      throw new Error(errorMessage)
    }

    return {
      refId: json.data.ref_id,
      cardHash: json.data.card_hash,
      cardPan: json.data.card_pan,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("خطای ناشناخته در تأیید پرداخت.")
  }
}

// ============================================================
// ۳. توابع کمکی (اختیاری)
// ============================================================

/**
 * تبدیل ریال به تومان (تقسیم بر ۱۰)
 */
export function toToman(rialAmount: number): number {
  return Math.round(rialAmount / 10)
}

/**
 * تبدیل تومان به ریال (ضرب در ۱۰)
 */
export function toRial(tomanAmount: number): number {
  return tomanAmount * 10
}
