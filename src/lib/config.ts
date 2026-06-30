export const siteConfig = {
  name: "باب شاپ",

  tagline: "فروشگاه تخصصی قطعات الکترونیک و تجهیزات هوشمند",

  description:
    "خرید ESP32، آردوینو، ماژول‌ها، ابزار تعمیرات و تجهیزات الکترونیک با ارسال سریع.",

  announcement: "ارسال سریع به سراسر ایران",

  url: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",

  contact: {
    email: "support@babshop.ir",
    phone: "",
    address: {
      street: "",
      suite: "",
      city: "",
      state: "",
      zip: "",
    },
  },

  social: {
    twitter: "",
    instagram: "",
    facebook: "",
    youtube: "",
    tiktok: "",
  },

  freeShippingThreshold: 1000000,
  taxRate: 0,

  currency: "IRR",
  locale: "fa-IR",

  copyrightYear: new Date().getFullYear(),
} as const

export type SiteConfig = typeof siteConfig
