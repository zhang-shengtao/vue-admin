<template>
  <div style="border: 1px solid #ccc" :style="{ zIndex: nextZIndex() }">
    <Toolbar :editor="editorRef" style="border-bottom: #ccc 1px solid" :defaultConfig="toolbarConfig" />
    <Editor v-model="valueHtml" :defaultConfig="editorConfig" style="height: 500px" @onCreated="onCreated" />
  </div>
</template>

<script setup>
  // wangeditor 官网地址 https://www.wangeditor.com/v5/
  import { useZIndex } from "element-plus";
  import "@wangeditor/editor/dist/css/style.css";
  import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
  const { nextZIndex } = useZIndex();
  const editorRef = shallowRef();
  const valueHtml = ref("");

  const toolbarConfig = {}; // 工具栏配置
  const editorConfig = {
    placeholder: "请输入内容...",
    showLinkImg: false,
    MENU_CONF: {
      uploadImage: {
        base64LimitSize: 500 * 1024, // 小于5kb就插入base64格式（而不上传）
        customUpload: (file, insertFn) => {
          const url = URL.createObjectURL(new Blob([file]));
          console.log("需要自定义上传逻辑");
          insertFn(url);
        },
      },
      uploadVideo: {
        customUpload(file, insertFn) {
          const url = URL.createObjectURL(new Blob([file]));
          console.log("需要自定义上传逻辑", file);
          insertFn(url);
        },
      },
    },
  }; // 编辑器配置

  const onCreated = (editor) => {
    editorRef.value = editor;
  };

  function destroy() {
    if (!editorRef.value) return;
    if (!editorRef.value.destroy) return;
    editorRef.value.destroy();
  }

  defineExpose({ destroy });
</script>

<style lang="scss" scoped></style>
