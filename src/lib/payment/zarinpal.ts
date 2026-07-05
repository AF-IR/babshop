const ZARINPAL_API = "https://api.zarinpal.com/pg/v4/payment"

const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID!

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

export async function requestPayment(
  input: PaymentRequestInput
): Promise<PaymentRequestResult> {
  const res = await fetch(`${ZARINPAL_API}/request.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      merchant_id: MERCHANT_ID,
      amount: input.amount,
      callback_url: input.callbackUrl,
      description: input.description,
      metadata: {
        mobile: input.mobile,
        email: input.email,
      },
    }),
  })

  const json = await res.json()

  if (json.data?.code !== 100) {
    throw new Error(
      json.errors?.message || "خطا در ایجاد درخواست پرداخت"
    )
  }

  return {
    authority: json.data.authority,
    url: `https://www.zarinpal.com/pg/StartPay/${json.data.authority}`,
  }
}

export async function verifyPayment(
  authority: string,
  amount: number
) {
  const res = await fetch(`${ZARINPAL_API}/verify.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      merchant_id: MERCHANT_ID,
      authority,
      amount,
    }),
  })

  const json = await res.json()

  if (json.data?.code !== 100 && json.data?.code !== 101) {
    throw new Error(
      json.errors?.message || "پرداخت تایید نشد."
    )
  }

  return {
    refId: json.data.ref_id,
    cardHash: json.data.card_hash,
    cardPan: json.data.card_pan,
  }
}
