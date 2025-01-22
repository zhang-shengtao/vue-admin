<template>
  <div class="tag column-center">
    <my-icon class="ArrowLeftBold icon_hover" name="ArrowLeftBold" @click="scroll('left')" />
    <el-scrollbar ref="scrollbar" style="flex: 1" @scroll="(v) => (scrollLeft = v.scrollLeft)">
      <el-space ref="space">
        <el-tag
          @click="routerPush(item)"
          @mouseenter="item.closable = true"
          @mouseleave="item.closable = false"
          :closable="!!item.closable"
          @close="delTag(i)"
          disable-transitions
          style="cursor: pointer"
          :effect="item.path === $route.path ? 'dark' : 'light'"
          v-for="(item, i) in tag"
          :key="item.path"
          >{{ item.name }}</el-tag
        >
      </el-space>
    </el-scrollbar>
    <my-icon class="ArrowRightBold icon_hover" name="ArrowRightBold" @click="scroll('right')" />
    <el-dropdown placement="bottom">
      <my-icon name="Menu" :size="22" />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="mainAppKeyComponent = randomString()">刷新当前页</el-dropdown-item>
          <el-dropdown-item @click="colseAllPage">关闭全部</el-dropdown-item>
          <el-dropdown-item @click="toggle">全屏</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script setup>
  import { randomString } from "@/utils/method.js";
  const mainAppKeyComponent = inject("mainAppKeyComponent");
  const route = useRoute();
  const tag = inject("tag");
  const delKeepAlive = inject("delKeepAlive");
  const scrollLeft = ref(0); // 滚动条当前所在的位置
  const scrollbar = ref(null); // 滚动窗口的宽度
  const space = ref(null); // 可滚动的区域
  const seep = 60; // 步移的距离
  const router = useRouter();

  function routerPush(item) {
    if (item.path === route.path) return;
    if (item.target) {
      const routeData = router.resolve(item.path);
      return window.open(routeData.href, "_blank");
    }
    router.push({ path: item.path });
  }

  function scroll(v) {
    scrollbar.value.update();
    let offsetWidth = space.value.$el.offsetWidth - scrollbar.value.wrapRef.offsetWidth;
    if (v == "left" && scrollLeft.value <= 0) return scrollbar.value.setScrollLeft(seep);
    if (v == "right" && scrollLeft.value >= offsetWidth) return scrollbar.value.setScrollLeft(scrollLeft.value - seep);
    if (v == "left" && scrollLeft.value < offsetWidth) scrollbar.value.setScrollLeft((scrollLeft.value += seep));
    if (v == "right" && scrollLeft.value > 0) scrollbar.value.setScrollLeft((scrollLeft.value -= seep));
    scrollbar.value.update();
  }

  function delTag(i) {
    const item = tag[i];
    if (item.path === route.path || tag.length === 1) return ElMessage("正在浏览当前页面不能删除");
    delKeepAlive.value = tag[i].componentName;
    tag.splice(i, 1);
  }

  function colseAllPage() {
    function del(arr) {
      if (arr.length <= 1) return void 0;
      let item = arr[arr.length - 1];
      if (item.path === route.path) {
        item = arr[0];
      }
      const i = arr.findIndex((val) => val.path === item.path);
      delKeepAlive.value = arr[i].componentName;
      arr.splice(i, 1);
      del(arr);
    }
    del(tag);
  }

  let fn = null;
  const isFullscreen = ref(false);
  function toggle() {
    fn && fn();
  }
  onMounted(() => {
    const { isFullscreen: isFullscreens, toggle } = useFullscreen(document.getElementById("MyMainApp"));
    fn = toggle;
    isFullscreen.value = isFullscreens.value;
  });
</script>

<style lang="scss" scoped>
  .column-center {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .tag {
    height: 30px;
    box-shadow: var(--box-shadow-color);
    padding: 0 15px;
    box-sizing: border-box;

    .ArrowLeftBold {
      padding-right: 5px;
    }
    .ArrowRightBold {
      padding: 0 5px;
    }

    :deep(.el-scrollbar__view) {
      display: flex;
      align-items: center;
      height: 100%;
    }

    :deep(.el-scrollbar__bar.is-horizontal) {
      height: 4px;
    }
  }
</style>
