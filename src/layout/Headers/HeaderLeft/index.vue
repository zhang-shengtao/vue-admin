<template>
  <el-space :size="15">
    <Icon class="icon_hover" :name="isShowMenu ? 'Expand' : 'Fold'" @click="isShowMenu = !isShowMenu" />
    <Breadcrumb />
  </el-space>
</template>

<script setup>
import Breadcrumb from "./Breadcrumb.vue";
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
  }
});
</script>

<style lang="scss" scoped></style>
