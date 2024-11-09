import NProgress from "nprogress";
import "nprogress/nprogress.css";
NProgress.configure({ showSpinner: false });
import { config } from "@/config";
import { userPinia } from "@/src/pinia";
import { storageKey } from "@/config.js";
import { getStorage } from "@/src/utils/storage.js";
import { clearRequests } from "@/src/utils/request.js";

// 这路由拦截器需要根据项目实际情况进行更改
const whiteList = ["/login", "/404"]; // 路由白名单

export default function (router) {
  router.beforeEach(async (to, from, next) => {
    const { userInfo, getRouterInfo, getUserInfo } = userPinia();
    const title = useTitle("后台管理系统");
    clearRequests();
    NProgress.start();
    if (to.meta && to.meta.title) title.value = to.meta.title;
    if (getStorage(storageKey.token)) {
      if (to.path === "/login") {
        next("/");
        NProgress.done();
      } else {
        if (userInfo.username) {
          next();
          NProgress.done();
        } else {
          try {
            if (!config.isAddRouter) {
              await getUserInfo(); // 如果不是动态路由
            } else {
              await getRouterInfo(); // 动态路由
            }
            next({ ...to, replace: true });
            NProgress.done();
          } catch (err) {
            console.log("错误信息", err);
            next(`/login?redirect=${to.path}`);
            NProgress.done();
          }
        }
      }
    } else {
      if (whiteList.includes(to.path)) return next();
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  });
  router.afterEach(() => {
    NProgress.done();
  });
}
