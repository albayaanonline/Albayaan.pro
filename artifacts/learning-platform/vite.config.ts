import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const port = Number(process.env.PORT ?? 3000);
const basePath = process.env.BASE_PATH ?? "/";

export default defineConfig(async () => {
  const replitPlugins: PluginOption[] =
    process.env.NODE_ENV !== "production" && process.env.REPL_ID
      ? [
          await import("@replit/vite-plugin-runtime-error-modal").then(
            (m) => m.default() as PluginOption,
          ),
          await import("@replit/vite-plugin-cartographer").then(
            (m) =>
              m.cartographer({
                root: path.resolve(import.meta.dirname, ".."),
              }) as PluginOption,
          ),
          await import("@replit/vite-plugin-dev-banner").then(
            (m) => m.devBanner() as PluginOption,
          ),
        ]
      : [];

  return {
    base: basePath,
    plugins: [react(), tailwindcss(), ...replitPlugins],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
      },
      dedupe: ["react", "react-dom"],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist"),
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor:  ["react", "react-dom"],
            router:  ["wouter"],
            motion:  ["framer-motion"],
            query:   ["@tanstack/react-query"],
            ui:      ["lucide-react"],
          },
        },
      },
    },
    server: {
      port,
      strictPort: true,
      host: "0.0.0.0",
      allowedHosts: true as true,
      fs: { strict: false },
    },
    preview: {
      port,
      host: "0.0.0.0",
      allowedHosts: true as true,
    },
  };
});
