const target = true; // 显示在侧边目录点击是否打开一个新页面

export default [
  {
    path: "/visual",
    meta: { title: "可视化", icon: "Promotion", target },
    component: () => import("@/src/view/visual/index.vue"),
  },
];
