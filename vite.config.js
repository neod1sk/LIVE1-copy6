import { defineConfig } from "vite";

const basePath = process.env.NODE_ENV === "production" ? "/LIVE1-copy6/" : "/";

export default defineConfig({
  root: ".",
  base: basePath,
  server: {
    open: true,
    host: "0.0.0.0",
    port: 8000,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});



