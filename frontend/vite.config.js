// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // permite acceder desde fuera (no solo localhost)
    port: 5173,
    allowedHosts: [
      "dev-akasaka.vasilako.com.es", // 👈 tu dominio Cloudflare Tunnel
    ],
  },
});
