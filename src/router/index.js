export * from "vue-router";
import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import middleware from "./permission";
import { config } from "#/config";

const modules = import.meta.glob("./modules/*.js", { eager: true });
const staticRoute = []; // 静态路由(如果不需要动态路由那所有路由就是静态路由不需要处理直接注册)
const moduleRoutes = []; // 动态路由(如果需要动态路由那就是需要处理的动态路由) isAddRouter= true

for (const path in modules) {
  const mod = modules[path];
  const name = path.split("/").pop().replace(/\.js$/, "");
  if (!config.isAddRouter || name === "static") {
    staticRoute.push(...mod.default);
  } else {
    moduleRoutes.push(...mod.default);
  }
}

export const routes = staticRoute;

export const moduleRoute = moduleRoutes;

let router;
export default function _createRouter() {
  if (router) return router;
  router = createRouter({
    history: createWebHistory(config.base),
    routes: routes.filter((route) => !route.path.startsWith("http")),
    strict: true,
  });
  middleware(router);
  return router;
}
