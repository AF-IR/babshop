import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { redirects as redirectRules } from "./src/lib/redirects";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s33.picofile.com",
      },
    ],
  },
};

export default nextConfig;

  // Redirects are defined in src/lib/redirects.ts — edit there.
  async redirects() {
    return redirectRules;
  },
};

export default withNextIntl(nextConfig);
