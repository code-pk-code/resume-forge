import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    // ── Dev server ───────────────────────────────────────────
    server: {
      port: parseInt(env.PORT || "3000"),
      open: true,
      cors: true,
      headers: {
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
      },
    },

    // ── Production build ────────────────────────────────────
    build: {
      outDir: "dist",
      sourcemap: false,       // never expose source in prod
      minify: "esbuild",
      target: "es2020",
      chunkSizeWarningLimit: 400,
      rollupOptions: {
        output: {
          manualChunks: { vendor: ["react", "react-dom"] },
        },
      },
    },

    // ── Environment variable prefix ─────────────────────────
    // All VITE_* vars are inlined at build time.
    // See config/app.config.js for runtime-readable values.
    envPrefix: "VITE_",

    // ── Preview (post-build local testing) ──────────────────
    preview: {
      port: parseInt(env.PREVIEW_PORT || "4173"),
      open: true,
    },
  };
});
