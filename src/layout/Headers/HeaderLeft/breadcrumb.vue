<template>
  <el-breadcrumb separator="/" class="breadcrumb">
    <template v-for="item in $route.matched" :key="item.path">
      <el-breadcrumb-item v-if="item.path != '/'">
        {{ item.meta.title }}
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script setup></script>

<style lang="scss" scoped></style>
