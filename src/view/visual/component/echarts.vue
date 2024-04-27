<template>
  <div ref="dom"></div>
</template>

<script setup>
import * as echarts from "echarts";
import "echarts-gl";
import { onUnmounted, watch } from "vue";
const props = defineProps({
  option: {
    type: Object,
    required: true,
    default: {},
  },
});
const dom = ref();
let myChart = ref(null);

function init() {
  myChart.value = echarts.init(dom.value);
  useResizeObserver(dom, (val) => {
    const { height, width } = val[0].contentRect;
    myChart.value.resize({ height, width });
  });
}

watch(
  () => props.option,
  (val) => {
    myChart.value.setOption(val, true);
  }
);

defineExpose({ myChart });
onMounted(() => {
  init();
});
onUnmounted(() => {
  myChart.value.dispose();
  myChart.value = null;
});
</script>

<style lang="scss" scoped></style>
