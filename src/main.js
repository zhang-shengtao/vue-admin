import components from "./components";
import _createPinia from "@/src/pinia";
import _createRouter, { RouterView } from "@/src/router";
import directive from "./directive";

import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/src/assets/style.scss";

export default function _createApp() {
  const app = createApp(h(ElConfigProvider, { locale: zhCn, message: { max: 2 } }, () => h(RouterView)));
  const pinia = _createPinia();
  const router = _createRouter();
  app.use(router);
  app.use(pinia);
  app.use(directive);
  app.use(components);
  router.isReady().then(() => {
    app.mount("#app");
  });
  return { app, pinia, router };
}

_createApp();
