<template>
  <el-space :size="15">
    <my-icon class="icon_hover" :name="isShowMenu ? 'Expand' : 'Fold'" @click="isShowMenu = !isShowMenu" />
    <breadcrumb />
  </el-space>
</template>

<script setup>
import Breadcrumb from "./breadcrumb.vue";
import { layoutData } from "@/src/layout";
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

<style lang="scss" scoped></style>
