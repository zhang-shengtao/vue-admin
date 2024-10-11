<template>
  <el-autocomplete
    v-model.trim="searchMenus"
    clearable
    :fetch-suggestions="querySearch"
    placeholder="请输入页面名称"
    @select="handleSelect"
    style="width: 240px"
  />
</template>

<script setup>
import { userPinia } from "@/src/pinia";
const { searchMenu } = userPinia();
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
</script>

<style lang="scss" scoped></style>
