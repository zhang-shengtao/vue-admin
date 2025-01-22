<template>
  <div class="mytest">
    <el-card>
      <Form.form1 :formData="formData" />
      <Form.form2 v-model="isShow" />
      <el-input v-model="formData.password" placeholder="缓存"></el-input>

      <el-button @click="isShow = true">显示</el-button>
      <!-- <img src="@/public/vite.svg" alt="" style="width: 30px; height: 30px" /> -->
      <my-icon name="ei:like" color="red" :size="30" />
      <myEditor />
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

  function contenteditable(e) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const focusedElement = range.startContainer.nodeType === Node.TEXT_NODE ? range.startContainer.parentNode : range.startContainer;

      console.log(focusedElement);
    }
  }

  onBeforeUnmount(() => {});
</script>

<style lang="scss" scoped>
  .content {
    height: 500px;
    color: #4c7e13;
  }
  .edit {
    width: 200px;
    height: 200px;
    border: 1px solid #ccc;
    overflow-y: scroll;
    scrollbar-width: thin; /* 'auto' | 'thin' | 'none' */
    scrollbar-color: #dddddd transparent; /* thumb color, track color */
    -ms-overflow-style: -ms-autohiding-scrollbar;
  }
  .edit::-webkit-scrollbar {
    width: 6px;
  }
  .edit::-webkit-scrollbar-track {
    background: transparent;
  }
  .edit::-webkit-scrollbar-thumb {
    background: #dddddd;
    border-radius: 10px;
  }
  .edit[contenteditable] {
    outline: none;
  }
</style>
