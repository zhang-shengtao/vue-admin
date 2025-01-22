<template>
  <el-space :size="15">
    <my-icon class="icon_hover" :name="isShowMenu ? 'Expand' : 'Fold'" @click="isShowMenu = !isShowMenu" />
    <el-breadcrumb separator="/" class="breadcrumb">
      <template v-for="item in $route.matched" :key="item.path">
        <el-breadcrumb-item v-if="item.path != '/'">
          {{ item.meta.title }}
        </el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </el-space>
</template>

<script setup>
  import { layoutData } from "@/layout";
  const { winWidth, isModel, isCollapse } = layoutData();

  const isShowMenu = computed({
    get() {
      if (winWidth.value <= 750) return isModel.value;
      return isCollapse.value;
    },
    set(val) {
      if (winWidth.value <= 750) {
        isModel.value = val;
      } else {
        isCollapse.value = val;
      }
    },
  });
</script>
