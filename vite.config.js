import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  root: ".",
  base: mode === "production" ? "/LIVE1-copy6/" : "/",
  server: {
    open: true,
    host: "0.0.0.0",
    port: 8000,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
}));



