<template>
  <el-icon :size="size" :color="color" class="icon" v-if="ElementPlusIconsVue[name]">
    <component :is="ElementPlusIconsVue[name]" />
  </el-icon>
  <Icon class="icon" v-else-if="name.includes(':')" :color="color" :icon="name" :width="size" :height="size" :="$attrs" />
  <svg class="icon" v-else aria-hidden="true" :width="size" :height="size">
    <use :href="'#my-' + name" fill="red" />
  </svg>
</template>

<script setup>
  // https://icon-sets.iconify.design 获取iconify图标网址
  import * as ElementPlusIconsVue from "@element-plus/icons-vue";
  import { Icon } from "@iconify/vue"; // 引入iconify图标库
  import "virtual:svg-icons-register"; // 对应src/assets/svg目录下的svg图标 自动注册
  defineProps({
    name: {
      type: String,
      required: true,
      default: "",
    },
    size: {
      type: Number,
      default: 18,
    },
    color: {
      type: String,
    },
  });
</script>

<style lang="scss" scoped>
  .icon {
    cursor: pointer;
    vertical-align: middle;
  }
</style>
