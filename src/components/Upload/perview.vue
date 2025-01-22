<template>
  <ElImageViewer :="$attrs" v-bind="attrs" ref="viewer">
    <slot />
  </ElImageViewer>
</template>

<script setup>
  const props = defineProps({
    urlList: {
      type: [Array, String],
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true,
    },
    infinite: {
      type: Boolean,
      default: true,
    },
    hideOnClickModal: {
      type: Boolean,
      default: true,
    },
    teleported: {
      type: Boolean,
      default: true,
    },
  });
  const viewer = useTemplateRef("viewer");

  const attrs = computed(() => {
    return {
      ...markRaw(props),
      urlList: Array.isArray(props.urlList) ? props.urlList : [props.urlList],
    };
  });

  // TODO:以下参数属性事件是看element-plus的文档和源码
  // const props = defineProps({
  //   urlList: {
  //     type: [Array, String],
  //     default: [],
  //   },
  //   //设置图片预览的 z-index
  //   zIndex: {
  //     type: Number,
  //   },
  //   //初始预览图像索引，小于 url-list 的长度
  //   initialIndex: {
  //     type: Number,
  //     default: 0,
  //   },
  //   //是否可以无限循环预览
  //   infinite: {
  //     type: Boolean,
  //     default: true,
  //   },
  //   // 是否可以通过按下 ESC 关闭 Image Viewer
  //   closeOnPressEscape: {
  //     type: Boolean,
  //     default: true,
  //   },
  //   //是否可以通过点击遮罩层关闭 preview
  //   hideOnClickModal: {
  //     type: Boolean,
  //     default: true,
  //   },
  //   // 是否将组件插入至 body 元素上
  //   teleported: {
  //     type: Boolean,
  //     default: true,
  //   },
  //   //图像查看器缩放事件的缩放速率。
  //   zoomRate: {
  //     type: Number,
  //     default: 0.2,
  //   },
  //   //图像查看器缩放事件的最小缩放比例
  //   minScale: {
  //     type: Number,
  //     default: 0.2,
  //   },
  //   //图像查看器缩放事件的最大缩放比例
  //   maxScale: {
  //     type: Number,
  //     default: 7,
  //   },
  //   //原生img属性 crossorigin
  //   crossorigin: {
  //     type: "anonymous" || "use-credentials",
  //     default: "",
  //   },
  // });
  // const emiter = defineEmits(["close", "switch", "rotate"]);
  // 切换图片事件
  // function switchs(index) {
  // emiter("switch", index);
  // }
  // 旋转图片事件
  // function rotate(deg) {
  // emiter("rotate", deg);
  // }
  // 手动切换图片
  // function setActiveItem(){
  //   viewer.value.setActiveItem(props.initialIndex)
  // }

  defineExpose(
    new Proxy(
      {},
      {
        get(target, key) {
          return viewer.value?.[key];
        },
        has(target, key) {
          return key in viewer.value;
        },
      },
    ),
  );
</script>
