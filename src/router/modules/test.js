import layout from "@/layout";

const keepAlive = true; // 是否缓存当前页面
const hidden = true; // 是否隐藏当前目录
const isScreen = true; // 是否占满mainApp的内容
const target = true; // 显示在侧边目录点击是否打开一个新的标签页

export default [
  {
    path: "/test",
    redirect: "/test/t",
    name: "test",
    meta: { title: "测试二级路由", icon: "devicon:jenkins" },
    component: layout,
    children: [
      {
        path: "t",
        meta: { title: "关于", icon: "devicon:godot", keepAlive },
        name: "t",
        component: () => import("@/view/about/test.vue"),
      },
      {
        path: "test_home",
        meta: { title: "二级1", icon: "cif:cn", keepAlive },
        props: { test: "这里是测试的数据路由传参" },
        name: "test_home",
        component: () => import("@/view/home/index.vue"),
      },
      {
        path: "http://baidu.com",
        meta: { title: "TO百度", icon: "fxemoji:monkeysee" },
      },
    ],
  },
];
