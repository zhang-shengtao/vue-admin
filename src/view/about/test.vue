<template>
  <div class="mytest">
    <el-card>
      <Form.form1 :formData="formData" />
      <Form.form2 v-model="isShow" />
      <el-input v-model="formData.password" placeholder="缓存"></el-input>

      <el-button @click="isShow = true">显示</el-button>
      <img src="@/public/vite.svg" alt="" style="width: 30px; height: 30px" />
    </el-card>
  </div>
</template>

<script setup>
import * as Form from "./form.jsx";

const formData = reactive({
  name: "namename",
  password: "passwordpassword",
});
const isShow = ref(false);

onBeforeUnmount(() => {});
</script>

<style lang="scss" scoped>
.content {
  height: 500px;
  color: #4c7e13;
}
</style>
