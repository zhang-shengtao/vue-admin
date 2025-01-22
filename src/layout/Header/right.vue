<template>
  <el-space :size="15" class="float_right">
    <my-icon class="icon_hover" :name="isFullscreen ? 'mingcute:fullscreen-exit-line' : 'ri:fullscreen-line'" :size="22" @click="toggle" v-if="winWidth > 750" />
    <my-icon class="icon_hover" :name="layoutInfoData.theme === 'normal' ? 'Moon' : 'Sunny'" :size="22" @click="theme" />
    <el-autocomplete v-if="winWidth > 750" v-model.trim="searchMenus" clearable :fetch-suggestions="querySearch" placeholder="请输入页面名称" @select="handleSelect" style="width: 240px" />
    <my-icon class="icon_hover" @click="layout" name="SwitchButton" :size="22" />
  </el-space>
</template>

<script setup>
  import { userPinia } from "@/pinia";
  import { layoutData } from "@/layout";
  import { removeStorage } from "@/utils/storage";
  import { storageKey } from "#/config";
  const { isFullscreen, toggle } = useFullscreen(document.documentElement);
  const { layoutInfoData, winWidth } = layoutData();
  const { resetRouter, searchMenu } = userPinia();
  const router = useRouter();
  const searchMenus = ref("");

  function querySearch(searchName, callback) {
    if (searchName) {
      callback(searchMenu.filter((item) => item?.value.includes(searchName)));
    } else {
      callback([]);
    }
  }
  function handleSelect({ path, target }) {
    searchMenus.value = "";

    if (target) {
      const routeData = router.resolve(path);
      return window.open(routeData.href, "_blank");
    }

    if (path.startsWith("http")) {
      return window.open(path);
    }
    router.push({ path });
  }

  function theme() {
    layoutInfoData.theme = layoutInfoData.theme === "normal" ? "dark" : "normal";
    document.documentElement.className = layoutInfoData.theme;
  }

  function layout() {
    ElMessageBox.confirm("确认退出登录吗?", "提示", { type: "warning", draggable: true }).then(() => {
      removeStorage(storageKey.token);
      resetRouter();
      router.replace("/login");
    });
  }
</script>
