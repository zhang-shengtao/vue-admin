import layout from "@/src/layout";

const keepAlive = true; // 是否缓存当前页面
const hidden = true; // 是否隐藏当前目录
const isScreen = true; // 是否占满mainApp的内容
const target = true; // 显示在侧边目录点击是否打开一个新的标签页

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
        meta: { title: "关于", icon: "HomeFilled", keepAlive },
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
