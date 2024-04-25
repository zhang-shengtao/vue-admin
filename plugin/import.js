import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default function () {
  return [
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    AutoImport({
      dts: false,
      imports: ["vue-router", "vue", "pinia", "@vueuse/core"],
      resolvers: [ElementPlusResolver()],
    }),
  ];
}
