<template>
  <div class="header"></div>
  <div class="content">
    <div class="item item1" />
    <my-echarts :option="option" ref="myEcharts" class="item item2" />
    <div class="item item3">3</div>
    <div class="item item4">4</div>
    <div class="item item5">5</div>
    <div class="item item6">6</div>
    <div class="item item7">7</div>
    <div class="item item8">8</div>
  </div>
</template>

<script setup>
  import { getPie3D } from "./echarts";
  const option = ref({});
  const { width, height } = useWindowSize();
  const w = 1920; // 设计稿宽高
  const h = 1080; // 设计稿宽高
  const scal = ref(0.8);

  console.log(useId(), width, height);

  watch(width, (val) => {
    if (val >= 750 && val < 1200) {
      console.log(val);
    }
  });

  const op = getPie3D(
    [
      {
        name: "性能测试",
        value: 134,
        itemStyle: {
          color: "#99D3F3",
        },
      },
      {
        name: "安全",
        value: 56,
        itemStyle: {
          color: "#007AFF",
        },
      },
      {
        name: "功能",
        value: 57,
        itemStyle: {
          color: "#2acf81",
        },
      },
      {
        name: "易用性",
        value: 51,
        itemStyle: {
          color: "#1F9AA7",
        },
      },
      {
        name: "代码",
        value: 11,
        itemStyle: {
          color: "#F5B64C",
        },
      },
    ],
    0,
  );

  const myEchart = useTemplateRef("myEcharts");

  onMounted(() => {
    option.value = op;
  });
</script>

<style lang="scss" scoped>
  .header {
    width: 100%;
    height: 100px;
    background-color: aliceblue;
  }
  .content {
    height: calc(100% - 100px);
    display: grid;
    gap: 15px;
    padding: 15px;
    box-sizing: border-box;
    background-color: rgb(7, 60, 95);
    grid-template: repeat(3, 1fr) / 0.6fr 1fr 0.6fr;
    .item {
      background-color: antiquewhite;
      box-sizing: border-box;
    }
    .item2 {
      grid-column: 2;
      grid-row: 1 / span 2;
    }
  }
</style>
