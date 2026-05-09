const backendUrl = process.env.BACKEND_URL;

if (!backendUrl) {
  throw new Error("BACKEND_URL is not set");
}

export const config = {
  rewrites: [
    {
      source: "/api/:path*",
      destination: `${backendUrl}/api/:path*`,
    },
    {
      source: "/((?!api/).*)",
      destination: "/index.html",
    },
  ],
};