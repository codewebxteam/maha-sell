export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/account",
          "/account/*",
          "/checkout",
          "/checkout/*",
          "/api/*",
          "/login",
          "/register"
        ],
      },
    ],
    sitemap: "https://mahasell.in/sitemap.xml",
  };
}
