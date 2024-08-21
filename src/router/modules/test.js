const keepAlive = true; // 是否缓存当前页面
const hidden = true; // 是否隐藏当前目录
const isScreen = true; // 是否占满mainapp的内容
import layout from "@/src/layout";

export default [
  {
    path: "/test",
    redirect: "/test/t",
    name: "test",
    meta: { title: "测试二级路由", icon: "HomeFilled" },
    component: layout,
    children: [
      {
        path: "t",
        meta: { title: "关于", icon: "HomeFilled" },
        name: "t",
        component: () => import("@/src/view/about/test.vue"),
      },
      {
        path: "test_home",
        meta: { title: "二级", icon: "HomeFilled", keepAlive },
        props: { test: "这里是测试的数据路由传参" },
        name: "test_home",
        component: () => import("@/src/view/home/index.vue"),
      },
    ],
  },
];
