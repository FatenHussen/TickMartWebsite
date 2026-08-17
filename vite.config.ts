import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
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
        target: "https://tickdash.tickmartsy.com",
        changeOrigin: true,
        secure: true,
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
});
