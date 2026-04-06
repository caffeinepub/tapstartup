import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import environment from "vite-plugin-environment";
import fs from "fs";
import path from "path";

const ii_url =
  process.env.DFX_NETWORK === "local"
    ? `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:8081/`
    : `https://identity.internetcomputer.org/`;

process.env.II_URL = process.env.II_URL || ii_url;
process.env.STORAGE_GATEWAY_URL =
  process.env.STORAGE_GATEWAY_URL || "https://blob.caffeine.ai";

// Plugin to copy dotfiles (e.g. .well-known, .ic-assets.json5) from public/ to dist/
function copyDotfilesPlugin() {
  return {
    name: "copy-dotfiles",
    closeBundle() {
      const publicDir = path.resolve(__dirname, "public");
      const distDir = path.resolve(__dirname, "dist");

      function copyRecursive(src, dest) {
        const stat = fs.statSync(src);
        if (stat.isDirectory()) {
          if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
          for (const child of fs.readdirSync(src)) {
            copyRecursive(path.join(src, child), path.join(dest, child));
          }
        } else {
          fs.copyFileSync(src, dest);
        }
      }

      // Copy .well-known folder
      const wellKnownSrc = path.join(publicDir, ".well-known");
      const wellKnownDest = path.join(distDir, ".well-known");
      if (fs.existsSync(wellKnownSrc)) {
        copyRecursive(wellKnownSrc, wellKnownDest);
        console.log("[copy-dotfiles] Copied .well-known to dist/");
      }

      // Copy .ic-assets.json5
      const icAssetsSrc = path.join(publicDir, ".ic-assets.json5");
      const icAssetsDest = path.join(distDir, ".ic-assets.json5");
      if (fs.existsSync(icAssetsSrc)) {
        fs.copyFileSync(icAssetsSrc, icAssetsDest);
        console.log("[copy-dotfiles] Copied .ic-assets.json5 to dist/");
      }
    },
  };
}

export default defineConfig({
  logLevel: "error",
  build: {
    emptyOutDir: true,
    sourcemap: false,
    minify: false,
  },
  css: {
    postcss: "./postcss.config.js",
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
    environment(["II_URL"]),
    environment(["STORAGE_GATEWAY_URL"]),
    react(),
    copyDotfilesPlugin(),
  ],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
    dedupe: ["@dfinity/agent"],
  },
});
