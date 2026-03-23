import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, new URL(".", import.meta.url).pathname, "");
  const port = Number(env.VITE_PORT || 5173);

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
    },
  };
});
