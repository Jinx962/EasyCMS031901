import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, new URL(".", import.meta.url).pathname, "VITE_");
  const port = Number(env.VITE_PORT || 5173);
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || "";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname,
      },
    },
    server: {
      host: "0.0.0.0",
      port,
      strictPort: true,
      proxy: apiProxyTarget
        ? {
            "/api": {
              target: apiProxyTarget,
              changeOrigin: true,
              secure: false,
            },
          }
        : undefined,
    },
  };
});
