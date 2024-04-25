<template>
  <el-autocomplete
    v-model.trim="searchMenus"
    clearable
    :fetch-suggestions="querySearch"
    placeholder="请输入页面名称"
    @select="handleSelect"
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
function handleSelect({ path }) {
  searchMenus.value = "";
  if (path.startsWith("http")) {
    window.open(path);
  } else {
    router.push({ path });
  }
}
</script>

<style lang="scss" scoped></style>
