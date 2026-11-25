import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Les paquets du dépôt unique sont fournis en TypeScript : Next les compile
  transpilePackages: ["@smart-collab/ui", "@smart-collab/i18n"],
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
