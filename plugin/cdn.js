import { Plugin as importToCDN } from "vite-plugin-cdn-import";
import externalGlobals from "rollup-plugin-external-globals";
export default function () {
  return [
    importToCDN({
      modules: [
        {
          name: "vue",
          var: "Vue",
          path: "https://cdn.staticfile.org/vue/3.3.4/vue.global.prod.min.js",
        },
        { name: "vue-demi", var: "VueDemi", path: "https://cdn.staticfile.org/vue-demi/0.14.5/index.iife.min.js" },
        {
          name: "element-plus",
          var: "ElementPlus",
          path: "https://cdn.staticfile.org/element-plus/2.3.8/index.full.min.js",
          css: "https://cdn.bootcdn.net/ajax/libs/element-plus/2.3.8/index.css",
        },
        {
          name: "pinia",
          var: "Pinia",
          path: "https://cdn.staticfile.org/pinia/2.1.6/pinia.iife.prod.min.js",
        },
        {
          name: "vue-router",
          var: "VueRouter",
          path: "https://cdn.staticfile.org/vue-router/4.2.4/vue-router.global.prod.min.js",
        },
        {
          name: "axios",
          var: "axios",
          path: "http://cdn.shiankuaixian.com/web/axios.min.js",
        },
        {
          name: "@element-plus/icons-vue",
          var: "ElementPlusIconsVue",
          path: "https://cdn.staticfile.org/element-plus-icons-vue/2.1.0/global.iife.min.js",
        },
      ],
    }),
    {
      ...externalGlobals({
        vue: "Vue",
        "vue-demi": "VueDemi",
        pinia: "Pinia",
        "vue-router": "VueRouter",
        "element-plus": "ElementPlus",
        axios: "axios",
        ElementPlusIconsVue: "@element-plus/icons-vue",
      }),
      enforce: "post",
      apply: "build",
    },
  ];
}
