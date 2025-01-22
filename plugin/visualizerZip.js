import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

export default function () {
  return [
    viteCompression({
      threshold: 512000, // 超过500k就压缩
      algorithm: "gzip",
      deleteOriginFile: false,
    }),
    visualizer({
      open: false,
      file: "stats.html",
    }),
  ];
}
