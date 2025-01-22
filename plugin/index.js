import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
// import Cdn from "./cdn";
import AutoImport from "./import";
import visualizerZip from "./visualizerZip";
import progress from "vite-plugin-progress";
import VueJsx from "@vitejs/plugin-vue-jsx";

export default function plugin() {
  return [
    vue(),
    VueJsx(),
    progress(),
    ...AutoImport(),
    // ...Cdn(),
    ...visualizerZip(),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), "src/assets/svg")],
      symbolId: "my-[name]",
    }),
  ];
}
