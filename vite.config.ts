import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Which API the dev server talks to. The deployed host by default; set
  // `VITE_DEV_PROXY_TARGET` in `.env.development.local` (git-ignored) to point
  // at a local `php artisan serve` instead.
  //
  // This matters more than it looks: the admin dashboard has its own
  // `.env.development.local` aimed at `http://127.0.0.1:8000`, so while it is
  // set that way, a section added in the dashboard lands in the **local**
  // database. Leaving this site on the remote host is what makes those sections
  // "not show up" — two databases, not a rendering bug.
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = env.VITE_DEV_PROXY_TARGET || "https://tickdash.tickmartsy.com";

  return {
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler"]],
        },
      }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      // The API host sends no Access-Control-Allow-Origin, so browsers block
      // direct calls from localhost. In dev we call the relative "/api" path and
      // let Vite proxy it server-side, where CORS does not apply.
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          // Certificate checks only apply to an https target; a local
          // `http://127.0.0.1:8000` has none to verify.
          secure: proxyTarget.startsWith("https://"),
          cookieDomainRewrite: "localhost",
          configure: (proxy) => {
            proxy.on("proxyRes", (proxyRes) => {
              // Ensure cookies are forwarded properly
              const setCookieHeaders = proxyRes.headers["set-cookie"];
              if (setCookieHeaders) {
                proxyRes.headers["set-cookie"] = setCookieHeaders.map((cookie) =>
                  cookie.replace(/Domain=[^;]+/gi, "Domain=localhost")
                );
              }
            });
          },
        },
      },
    },
  };
});
