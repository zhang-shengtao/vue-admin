const KeepAlive = true; // 是否缓存当前页面
const hidden = true; // 是否隐藏当前目录
const isScreen = true; // 是否占满mainapp的内容
import layout from "@/src/layout";
export default [
  {
    path: "/",
    redirect: "/home",
    name: "root",
    component: layout,
    children: [
      {
        path: "home",
        meta: { title: "首页", icon: "HomeFilled", KeepAlive, hidden, isScreen },
        props: { test: "这里是测试的数据路由传参" },
        name: "home",
        component: () => import("@/src/view/home/index.vue"),
      },
      {
        path: "about",
        meta: { title: "关于", icon: "HomeFilled" },
        name: "about",
        component: () => import("@/src/view/about/index.vue"),
      },
    ],
  },
];
