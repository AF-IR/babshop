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
    ],
  },

  // Redirects are defined in src/lib/redirects.ts
  async redirects() {
    return redirectRules;
  },
};

export default withNextIntl(nextConfig);
