import { defineConfig } from "vite";
import { resolve } from "path";
import plugins from "./plugin";
import { config } from "./config.js";

export default defineConfig({
  plugins: plugins(),
  base: config.base,
  server: {
    port: 8000,
    host: "0.0.0.0",
    proxy: {
      "^/api": {
        target: config.baseUrl,
        changeOrigin: true,
        pathRewrite: { "/^/supplierapi/": "/supplierapi" },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname),
    },
  },
  esbuild: {
    pure: ["console.log"],
    drop: ["debugger"],
  },
  build: {
    outDir: "build",
    // copyPublicDir: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => (id.includes("node_modules") ? "vendor" : ""),
        assetFileNames(pattern) {
          if (pattern.name.endsWith(".css")) return "css/[name]-[hash].css";
          if ([".png", ".jpg", ".svg", "jpeg", ".webp", ".gif", ".ico"].some((ext) => pattern.name.endsWith(ext))) {
            return "img/[name]-[hash].[ext]";
          }
          return "assest/[name]-[hash].[ext]";
        },
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
      },
    },
  },
  // optimizeDeps: {
  //   exclude:["vue", "vue-demi", "pinia", "vue-router", "element-plus", "axios", "@element-plus/icons-vue"]
  // },
});
