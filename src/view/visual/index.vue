<template>
  <div class="header"></div>
  <div class="content">
    <Echart :option="option" class="item item1" />
    <div class="item item2">2</div>
    <div class="item item3">3</div>
    <div class="item item4">4</div>
    <div class="item item5">5</div>
    <div class="item item6">6</div>
    <div class="item item7">7</div>
    <div class="item item8">8</div>
  </div>
</template>

<script setup>
import Echart from "./component/echarts.vue";
import { pie } from "./echarts";
const option = ref({});
const { width, height } = useWindowSize();
const w = 1920; // 设计稿宽高
const h = 1080; // 设计稿宽高
const scal = ref(0.8);

watch(width, (val) => {
  if (val >= 750 && val < 1200) {
    console.log(val);
  }
});

const op = pie([
  {
    name: "谷歌",
    value: 20,
  },
  {
    name: "火狐",
    value: 15,
  },
  {
    name: "IE",
    value: 40,
  },
  {
    name: "QQ浏览器",
    value: 15,
  },
  {
    name: "UC浏览器",
    value: 10,
  },
]);

onMounted(() => {
  // option.value = op;
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
