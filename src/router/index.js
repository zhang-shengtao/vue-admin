export * from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
import middleware from "./permission";
import statics from "./modules/static";
import moduleRouter from "./modules";
import { config } from "@/config";

export const routes = [...statics];

if (!config.isAddRouter) routes.push(...moduleRouter);
export const moduleRoute = moduleRouter;

let router;
export default function _createRouter() {
  if (router) return router;
  router = createRouter({
    history: createWebHistory(config.base),
    routes,
    strict: true,
  });
  middleware(router);
  return router;
}
