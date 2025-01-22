const keepAlive = true; // 是否缓存当前页面
const hidden = true; // 是否隐藏当前目录
const isScreen = true; // 是否占满mainApp的内容
const target = true; // 显示在侧边目录点击是否打开一个新的标签页
import layout from "@/layout";
export default [
  {
    path: "/",
    redirect: "/home",
    name: "root",
    component: layout,
    children: [
      {
        path: "home",
        meta: { title: "首页", icon: "devicon:yii", target, isScreen },
        props: { test: "这里是测试的数据路由传参" },
        name: "home",
        component: () => import("@/view/home/index.vue"),
      },
      {
        path: "about",
        meta: { title: "关于", icon: "devicon:prolog" },
        name: "about",
        component: () => import("@/view/about/index.vue"),
      },
    ],
  },
];
