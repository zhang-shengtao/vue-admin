<template>
  <div class="header" :style="{ height: `${headerHeight}px` }">
    <div class="header_title">
      <header-left />
      <header-right />
    </div>
    <tabs v-if="layoutInfoData.isTag" />
  </div>
</template>

<script setup>
import HeaderLeft from "./HeaderLeft/index.vue";
import HeaderRight from "./HeaderRight/index.vue";
import Tabs from "./tabs.vue";
import { layoutData } from "@/src/layout";
const { layoutInfoData, headerHeight } = layoutData();
</script>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 4;
  background-color: var(--el-header-bg);
  .header_title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 15px;
  }
}
</style>
