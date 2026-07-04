import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { redirects as redirectRules } from "./src/lib/redirects";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s33.picofile.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "image.torob.com",
      },
    ],
  },
  // Redirects are defined in src/lib/redirects.ts  https://image.torob.com/base/images/sO/9c/sO9cXKDCU9oRXTr7.jpg_/0x352.avif
  async redirects() {
    return redirectRules;
  },
};

export default withNextIntl(nextConfig);
