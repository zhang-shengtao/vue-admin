<template>
  <el-scrollbar height="100%" :style="{ width: menuWidth + 'px', left: winWidth <= 750 ? `${left}px` : 0 }" class="menus">
    <el-menu :default-active="$route.path" style="border: none; --el-menu-bg-color: transparent" :collapse="isCollapse">
      <menu-item v-for="item in menuArr" :key="item.path" :item="item" />
    </el-menu>
  </el-scrollbar>
</template>

<script setup>
  import MenuItem from "./menuItem.vue";
  import { userPinia } from "@/pinia";
  import { layoutData } from "@/layout";
  const { menuWidth, winWidth, isCollapse, isModel } = layoutData();
  const { menuArr } = userPinia();
  const left = computed(() => {
    if (winWidth.value > 750 || isModel.value) return 0;
    if (winWidth.value <= 750) return -menuWidth.value;
  });
</script>

<style lang="scss" scoped>
  .menus {
    position: fixed;
    background-color: var(--el-menu-bg-color);
    transition: all 0.5s;
    left: 0;
    top: 0;
    z-index: 5;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  }
</style>
