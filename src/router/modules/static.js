import layout from "@/layout";
const keepAlive = true; // 是否缓存当前页面
const hidden = true; // 是否隐藏当前目录
const isScreen = true; // 是否占满mainApp的内容
const target = true; // 显示在侧边目录点击是否打开一个新的标签页

/**
 * 静态路由所有角色打开都能看到的路由
 * @param {Boolean} hidden 为true表示不显示在菜单中
 * @param {Boolean} KeepAlive 为true表示缓存该组件
 * @module []
 */
export default [
  {
    path: "/login",
    meta: { title: "登录", hidden },
    name: "login",
    component: () => import("@/view/auth/login.vue"),
  },
  {
    path: "/404",
    alias: "/:pathMatch(.*)*",
    meta: { title: "404", hidden },
    component: () => import("@/view/auth/404.vue"),
  },
];
