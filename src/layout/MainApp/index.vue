<template>
  <el-main class="mainapp">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <div style="height: 100%" :key="route.path">
          <keep-alive :include="KeepAlive" :max="10">
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </div>
      </transition>
    </router-view>
  </el-main>
</template>

<script setup>
import { userPinia } from "@/src/pinia";
const { KeepAlive } = userPinia();
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
