<template>
  <el-scrollbar height="100%" class="content" :style="{ width: `calc(100% - ${winWidth <= 750 ? 0 : menuWidth}px)` }">
    <Headers></Headers>
    <MainApp
      :style="{
        [inherit]: `calc(100vh - ${headerHeight}px)`,
        padding: inherit === 'height' ? '0px' : '15px',
      }"
    />
  </el-scrollbar>
  <Menus></Menus>
  <div class="model" @click="isModel = !isModel" v-if="winWidth <= 750 && isModel"></div>
</template>

<script setup>
import { layoutData, Headers, MainApp, Menus } from "@/src/layout";
const { headerHeight, winWidth, menuWidth, isModel } = layoutData();
defineOptions({ name: "Layout" });
const inherit = ref("min-height");
const route = useRoute();
provide("mainAppKeyComponent", ref(""));
provide("tag", reactive([]));
provide("delKeepAlive", ref(""));
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
