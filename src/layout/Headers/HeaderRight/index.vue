<template>
  <el-space :size="15" class="float_right">
    <my-icon
      class="icon_hover"
      :name="isFullscreen ? 'mingcute:fullscreen-exit-line' : 'ri:fullscreen-line'"
      :size="22"
      @click="toggle"
      v-if="winWidth > 750"
    />
    <my-icon
      class="icon_hover"
      :name="layoutInfoData.theme === 'normal' ? 'Moon' : 'Sunny'"
      :size="22"
      @click="theme"
    />
    <search-page v-if="winWidth > 750" />
    <my-icon class="icon_hover" @click="layout" name="SwitchButton" :size="22" />
  </el-space>
</template>

<script setup>
import searchPage from "./searchPage.vue";
import { userPinia } from "@/src/pinia/user";
import { layoutData } from "@/src/layout";
import { removeStorage } from "@/src/utils/storage";
import { storageKey } from "@/config";
const { isFullscreen, toggle } = useFullscreen(document.documentElement);
const { layoutInfoData, winWidth } = layoutData();
const { resetRouter } = userPinia();

function theme() {
  layoutInfoData.theme = layoutInfoData.theme === "normal" ? "dark" : "normal";
  document.documentElement.className = layoutInfoData.theme;
}
const router = useRouter();
function layout() {
  ElMessageBox.confirm("确认退出登录吗?", "提示", { type: "warning", draggable: true }).then(() => {
    removeStorage(storageKey.token);
    resetRouter();
    router.replace("/login");
  });
}
</script>

<style lang="scss" scoped></style>
