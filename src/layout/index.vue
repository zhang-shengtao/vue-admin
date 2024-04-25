<template>
  <el-config-provider :locale="zhCn" :message="{ max: 2 }">
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
  </el-config-provider>
</template>

<script setup>
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { layoutData, Headers, MainApp, Menus } from "@/src/layout";
const { headerHeight, winWidth, menuWidth, isModel } = layoutData();
defineOptions({
  name: "layout",
});

const inherit = ref("min-height");
const route = useRoute();

function inherits(val) {
  if (val.meta.isScreen) {
    inherit.value = "height";
  } else {
    inherit.value = "min-height";
  }
}
inherits(route);
watch(route, inherits);
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
