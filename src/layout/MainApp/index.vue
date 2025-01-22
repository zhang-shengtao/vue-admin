<template>
  <el-main class="mainapp" id="MyMainApp" v-loading="loading" element-loading-background="rgba(122, 122, 122, 0.8)" element-loading-text="加载中. . .">
    <router-view #="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="keepAlives">
          <component :is="comp(Component, route)" :key="keys(route, key)" />
        </keep-alive>
      </transition>
    </router-view>
  </el-main>
</template>

<script setup>
  import { randomString } from "@/utils/method.js";
  const mainAppKeyComponent = inject("mainAppKeyComponent");
  const tag = inject("tag");
  const delKeepAlive = inject("delKeepAlive");
  let cacheKey = "";
  let componentName = "";
  const key = ref("");
  const keepAlives = reactive([]);
  const loading = ref(false);
  let time = null;
  let time1 = null;

  function deleKeepAlives(name) {
    if (!name) return;
    if (componentName === name) componentName = "";
    const isIncludes = keepAlives.includes(name);
    if (isIncludes) {
      keepAlives.splice(keepAlives.indexOf(name), 1);
      delKeepAlive.value = "";
    }
  }

  watch(delKeepAlive, deleKeepAlives);

  watch(mainAppKeyComponent, (val) => {
    time && clearTimeout(time);
    time1 && clearTimeout(time1);
    loading.value = true;
    const isInclude = keepAlives.includes(componentName);
    if (isInclude) {
      keepAlives.splice(keepAlives.indexOf(componentName), 1);
    }
    time = setTimeout(() => {
      key.value = val;
      time1 = setTimeout(() => {
        loading.value = false;
        if (!isInclude && componentName) {
          keepAlives.push(componentName);
        }
      }, 600);
    }, 500);
  });

  function comp(comp, route) {
    const name = comp.type.name || randomString();
    comp.type.name = name;
    const iskeepAlive = route.meta.keepAlive;
    const isIncludes = keepAlives.includes(name);
    const isIncludesTag = tag.some((item) => item.path === route.path);

    if (iskeepAlive && !isIncludes && !loading.value && !route.meta.hidden) {
      keepAlives.push(name);
    }

    if (!isIncludesTag && !route.meta.hidden && route.meta.title) {
      tag.push({ path: route.path, name: route.meta.title, componentName: name, target: route.meta.target });
    }

    if (iskeepAlive) {
      componentName = name;
    } else {
      componentName = "";
    }
    return h(comp);
  }

  function keys(route, key) {
    const path = route.path;
    let k = key === cacheKey ? path : key;
    cacheKey = key;
    return k;
  }
</script>

<style lang="scss" scoped>
  .mainapp {
    box-sizing: border-box;
    background-color: var(--mian-app-bg);
    overflow: hidden;
    transition: padding 0.5s;
  }
  .fade-transform-leave-active,
  .fade-transform-enter-active {
    transition: all 0.5s;
  }

  .fade-transform-enter {
    opacity: 0;
    transform: translateX(-30px);
  }

  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
</style>
