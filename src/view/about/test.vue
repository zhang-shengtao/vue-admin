<template>
  <div class="mytest">
    <el-card>
      <!-- <el-input v-model="text" placeholder="输入框"></el-input> -->

      <Editor />
    </el-card>
  </div>
</template>

<script setup>
import Editor from "@/src/components/Editor/index.vue";

onBeforeUnmount(() => {});
</script>

<style lang="scss" scoped></style>
