import { cpSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

function copyExcalidrawAssets(): Plugin {
  return {
    name: "copy-excalidraw-assets",
    closeBundle() {
      const source = resolve(
        "node_modules/@excalidraw/excalidraw/dist/prod/fonts",
      );
      const destination = resolve("dist/excalidraw-assets/fonts");
      mkdirSync(destination, { recursive: true });
      cpSync(source, destination, { recursive: true });
    },
  };
}

export default defineConfig({
  plugins: [react(), copyExcalidrawAssets()],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: resolve("overlay.html"),
    },
  },
});
