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
    proxy: {
      "/api": {
        target: "https://tikmool.octopus-software.online",
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: "localhost",
        configure: (proxy, _options) => {
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
