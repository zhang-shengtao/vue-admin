import _createPinia from "@/pinia";
import _createRouter, { RouterView } from "@/router";
import components from "./components";
import directive from "./directive";

import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/assets/style.scss";

export default async function _createApp() {
  try {
    const app = createApp(h(ElConfigProvider, { locale: zhCn, message: { max: 2 } }, () => h(RouterView)));
    app.config.idPrefix = "my-app";
    app.config.errorHandler = function (err, instance, info) {
      console.error(err, instance, info);
    };
    const pinia = _createPinia();
    const router = _createRouter();
    app.use(router);
    app.use(pinia);
    app.use(directive);
    app.use(components);
    await router.isReady();
    app.mount("#app");
    return { app, pinia, router };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

_createApp();
