export const siteConfig = {
  name: "باب شاپ",

  tagline: "فروشگاه تخصصی قطعات الکترونیک و تجهیزات هوشمند",

  description:
    "خرید ESP32، آردوینو، ماژول‌ها، ابزار تعمیرات و تجهیزات الکترونیک با ارسال سریع.",

  announcement: "ارسال سریع به سراسر ایران",

  url: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",

  contact: {
    email: "support@babshop.ir",
    phone: "00989010040035",
    address: {
      street: "مطهری",
      suite: "",
      city: "اصفهان",
      state: "کوچه ویلا شرقی پلاک ۱",
      zip: "8185241457",
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

  currency: "تومان",
  locale: "fa-IR",

  copyrightYear: new Date().getFullYear(),
} as const


export type SiteConfig = typeof siteConfig
