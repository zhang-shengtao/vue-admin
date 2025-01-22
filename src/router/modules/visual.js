const keepAlive = true; // 是否缓存当前页面
const hidden = true; // 是否隐藏当前目录
const isScreen = true; // 是否占满mainApp的内容
const target = true; // 显示在侧边目录点击是否打开一个新的标签页

export default [
  {
    path: "/visual",
    meta: { title: "可视化", icon: "devicon:visualstudio", target },
    component: () => import("@/view/visual/index.vue"),
  },
  {
    path: "http://baidu.com",
    meta: { title: "百度链接", icon: "Link" },
  },
];
