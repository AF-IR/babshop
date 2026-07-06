import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { redirects as redirectRules } from "./src/lib/redirects";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ✅ همه زیردامنه‌های picofile.com (s1, s2, ..., s100, ...)
      {
        protocol: "https",
        hostname: "*.picofile.com",
      },
      // ✅ باقی دامنه‌های قبلی
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "image.torob.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
  async redirects() {
    return redirectRules;
  },
};

export default withNextIntl(nextConfig);
