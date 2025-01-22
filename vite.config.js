import { defineConfig } from "vite";
import { resolve } from "path";
import plugins from "./plugin";
import { config } from "./config.js";

export default defineConfig({
  plugins: plugins(),
  base: config.base,
  server: {
    port: 51734,
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
      "#": resolve(__dirname),
      "@": resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    pure: ["console.log"],
    drop: ["debugger"],
  },
  build: {
    outDir: "build",
    assetsDir: "assets",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) return "vendor";
        },
        assetFileNames(assetInfo) {
          const name = assetInfo.name;
          if (name.endsWith(".css")) return "css/[name]-[hash].css";
          if ([".png", ".jpg", ".svg", "jpeg", ".webp", ".gif", ".ico"].some((ext) => name.endsWith(ext))) {
            return "img/[name]-[hash].[ext]";
          }
          return "assets/[name]-[hash].[ext]";
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
