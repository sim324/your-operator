import { withWorkflow } from "workflow/next";
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/demo",
        destination: "https://www.simbuilds.co/d/halden",
        permanent: false,
      },
      {
        source: "/demo/:path*",
        destination: "https://www.simbuilds.co/d/halden",
        permanent: false,
      },
    ];
  },
};
export default withWorkflow(nextConfig);
