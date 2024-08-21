<template>
  <div class="mytest">
    <el-card>
      <el-input v-model="text" placeholder="输入框"></el-input>
    </el-card>
  </div>
</template>

<script setup>
const text = ref("");
defineOptions({ name: "mytest" });
</script>

<style lang="scss" scoped></style>
