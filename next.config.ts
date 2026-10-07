import { withWorkflow } from "workflow/next";
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/demo",
        destination: "https://app.youroperator.ai/start",
        permanent: false,
      },
      {
        source: "/demo/:path*",
        destination: "https://app.youroperator.ai/start",
        permanent: false,
      },
    ];
  },
};
export default withWorkflow(nextConfig);
