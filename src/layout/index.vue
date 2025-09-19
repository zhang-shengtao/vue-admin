<template>
  <el-scrollbar height="100%" class="content" :style="{ width: `calc(100% - ${winWidth <= 750 ? 0 : menuWidth}px)` }">
    <my-header></my-header>
    <main-app :style="styleMain" />
  </el-scrollbar>
  <my-menu></my-menu>
  <div class="model" @click="isModel = !isModel" v-if="winWidth <= 750 && isModel"></div>
</template>

<script setup>
  import { layoutData, Header as MyHeader, MainApp as mainApp, Menu as MyMenu } from "@/layout";
  const { headerHeight, winWidth, menuWidth, isModel } = layoutData();
  defineOptions({ name: "layout" });
  const inherit = ref("min-height");
  const route = useRoute();
  provide("mainAppKeyComponent", ref(""));
  provide("tag", reactive([]));
  provide("delKeepAlive", ref(""));
  const styleMain = computed(() => ({ [inherit.value]: `calc(100vh - ${headerHeight.value}px)`, padding: inherit.value === "height" ? "0px" : "15px" }));

  function inherits(val) {
    if (val.meta.isScreen) {
      inherit.value = "height";
    } else {
      inherit.value = "min-height";
    }
  }
  watch(route, inherits, { immediate: true });
</script>

<style lang="scss" scoped>
  .model {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #0000005d;
    z-index: 4;
  }
  .content {
    float: right;
    transition: all 0.5s;
    :deep(.el-scrollbar__bar) {
      z-index: 4;
    }
  }
</style>
