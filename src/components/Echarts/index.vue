<template>
  <div ref="container" v-resize="resize" class="myEcharts"></div>
</template>

<script setup>
  import * as echarts from "echarts/core";
  import { BarChart, PieChart, LineChart } from "echarts/charts";
  import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components";
  // import { LabelLayout, UniversalTransition } from "echarts/features";
  import { CanvasRenderer } from "echarts/renderers";
  // import "echarts-gl";
  echarts.use([BarChart, PieChart, LineChart, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer]);
  const props = defineProps({ option: { type: Object, required: true, default: {} }, isShowMask: { type: Boolean, default: false } });
  let myChart = null;
  const container = useTemplateRef("container");
  watchEffect(draw);

  function resize({ w, h }) {
    if (!container.value) return;
    myChart.resize({ width: w, height: h });
  }

  function draw() {
    if (!container.value || !myChart) return;
    myChart.clear();
    if (props.isShowMask) {
      myChart.hideLoading();
      myChart.showLoading({ zlevel: 1, lineWidth: 3, text: "", color: "red", maskColor: "rgba(255, 255, 255, 0.8)" });
    }
    myChart.setOption(props.option);
    myChart.hideLoading();
  }

  onMounted(() => {
    myChart = echarts.init(container.value);
    myChart.showLoading({ zlevel: 1, lineWidth: 3, text: "", color: "red", maskColor: "rgba(255, 255, 255, 0.8)" });
  });

  onUnmounted(() => {
    if (!myChart) return;
    myChart.dispose();
    myChart = null;
  });

  defineExpose(
    new Proxy(
      {},
      {
        get(target, key) {
          return myChart?.[key];
        },
        has(target, key) {
          return key in myChart;
        },
      },
    ),
  );
</script>

<style scoped lang="scss">
  .myEcharts {
    width: 100%;
    height: 100%;
  }
</style>
