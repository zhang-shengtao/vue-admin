<template>
  <ElImageViewer :="props" />
</template>

<script setup>
const props = defineProps({
  urlList: {
    type: Array,
    default: [],
  },
  //设置图片预览的 z-index
  zIndex: {
    type: Number,
  },
  //初始预览图像索引，小于 url-list 的长度
  initialIndex: {
    type: Number,
    default: 0,
  },
  //是否可以无限循环预览
  infinite: {
    type: Boolean,
    default: true,
  },
  //是否可以通过点击遮罩层关闭 preview
  hideOnClickModal: {
    type: Boolean,
    default: true,
  },
  // 是否将组件插入至 body 元素上
  teleported: {
    type: Boolean,
    default: true,
  },
  //是否可以通过按下 ESC 关闭 Image Viewer
  closeOnPressEscape: {
    type: Boolean,
    default: true,
  },
  //图像查看器缩放事件的缩放速率。
  zoomRate: {
    type: Number,
    default: 1.2,
  },
  //图像查看器缩放事件的最小缩放比例
  minScale: {
    type: Number,
    default: 0.2,
  },
  //图像查看器缩放事件的最大缩放比例
  maxScale: {
    type: Number,
    default: 7,
  },
  //原生img属性 crossorigin
  crossorigin: {
    type: String,
    default: "use-credentials",
  },
});

const emiter = defineEmits({
  close: () => true,
  switch: (index) => isNumber(index),
  rotate: (deg) => isNumber(deg),
});
</script>

<style lang="scss" scoped></style>
