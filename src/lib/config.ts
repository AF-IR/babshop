export const siteConfig = {
  name: "ارزان پلاست",

  tagline: "فروشگاه وسایل پلاستیکی و ظروف و وسایل خانه و 3 راهی",

  description:
    "مرجع لوازک خانگی، وسایل پلاستیکی، سیم های سیار و 3 راهی با بهترین قیمت، ظروف آشپزخانه، ظروف یکبار مصرف",

  announcement: "خرید تک به قیمت عمده",

  url: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",

  contact: {
    email: "support.arzanplast@gmail.com",
    phone: "0098 90 100 400 35",
    address: {
      street: "خیابان وحید",
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

  freeShippingThreshold: 20000000,
  taxRate: 0,

  currency: "IRT",
  locale: "fa-IR",

  copyrightYear: new Date().getFullYear(),
} as const


export type SiteConfig = typeof siteConfig
