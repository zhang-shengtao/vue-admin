<template>
  <div ref="container" v-resize="resize" class="myEcharts"></div>
</template>

<script setup>
import * as echarts from "echarts";
import "echarts-gl";

const props = defineProps({
  option: {
    type: Object,
    required: true,
    default: {},
  },
  isShowMask: {
    type: Boolean,
    default: false,
  },
});
let myChart;
const container = useTemplateRef("container");
watchEffect(draw);

function resize({ w, h }) {
  if (!container.value) return;
  myChart.resize({
    width: w,
    height: h,
  });
}

function draw() {
  if (!container.value || !myChart) return;
  myChart.clear();
  myChart.setOption(props.option);
  myChart.hideLoading();
}

onMounted(() => {
  myChart = echarts.init(container.value);
  if (!props.isShowMask) return;
  myChart.showLoading({ zlevel: 1, lineWidth: 3, text: "", color: "red", maskColor: "rgba(255, 255, 255, 0.8)" });
});

onUnmounted(() => {
  if (!myChart) return;
  myChart.dispose();
  myChart = null;
});

function getCharts() {
  return myChart;
}

defineExpose({
  getCharts,
});
</script>

<style scoped lang="scss">
.myEcharts {
  width: 100%;
  height: 100%;
}
</style>
