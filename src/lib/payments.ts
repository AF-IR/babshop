export type PaymentMethod =
  | "zarinpal"
  | "idpay"
  | "offline"

export interface PaymentRequest {
  orderId: string
  amount: number
  method: PaymentMethod
}

export interface PaymentResponse {
  success: boolean

  authority?: string

  paymentUrl?: string

  message?: string
}

export async function createPayment(
  req: PaymentRequest
): Promise<PaymentResponse> {

  switch (req.method) {

    case "offline":

      return {

        success: true,

        authority: req.orderId,

        paymentUrl:
          `/checkout/success?order=${req.orderId}`,

      }

    case "zarinpal":

      throw new Error(
        "Zarinpal not implemented yet"
      )

    case "idpay":

      throw new Error(
        "IDPay not implemented yet"
      )

    default:

      throw new Error(
        "Unknown payment gateway"
      )

  }

}
