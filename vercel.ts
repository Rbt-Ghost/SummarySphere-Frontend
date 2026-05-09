import { deploymentEnv, routes, type VercelConfig } from "@vercel/config/v1";

const backendUrl = deploymentEnv("BACKEND_URL").replace(/\/+$/, "").replace(/\/api$/, "");

export const config: VercelConfig = {
  rewrites: [
    routes.rewrite("/api/:path*", `${backendUrl}/api/:path*`),
    routes.rewrite("/((?!api/).*)", "/index.html"),
  ],
};