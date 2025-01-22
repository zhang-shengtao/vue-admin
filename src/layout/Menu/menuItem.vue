<template>
  <el-sub-menu :index="item.path" v-if="item.children && item.children.length">
    <template #title>
      <my-icon v-if="item.meta && item.meta.icon" :name="item.meta.icon" style="margin-right: 5px" />
      <span>{{ (item.meta && item.meta.title) || "默认" }}</span>
    </template>
    <menu-item v-for="items in item.children" :key="items.path" :item="items" />
  </el-sub-menu>

  <app-link v-else :path="item.path" :target="item?.meta.target" @click="isModel = !isModel">
    <el-menu-item :index="item.path">
      <my-icon v-if="item.meta && item.meta.icon" :name="item.meta.icon" style="margin-right: 5px" />
      <template #title> {{ (item.meta && item.meta.title) || "默认" }}</template>
    </el-menu-item>
  </app-link>
</template>

<script setup>
  import AppLink from "./appLink.vue";
  import { layoutData } from "@/layout";
  const { isModel } = layoutData();
  defineProps(["item"]);
</script>
