// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    // tu dominio público del túnel
    allowedHosts: ["dev-akasaka.vasilako.com.es"],

    // MUY IMPORTANTE para URLs generadas por Vite (assets + HMR client)
    origin: "https://dev-akasaka.vasilako.com.es",

    // HMR por WSS + puerto 443 (no 5173)
    hmr: {
      protocol: "wss",
      host: "dev-akasaka.vasilako.com.es",
      clientPort: 443, // <- clave
      // overlay: false     // opcional, silencia overlay de errores si molesta
    },
  },
}));
