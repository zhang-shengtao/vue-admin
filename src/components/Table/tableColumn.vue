<template>
  <el-table-column :="tableColumnProp($attrs)">
    <template v-if="typeOf(children) === 'array' && children.length">
      <table-column v-for="(item, i) in children" :key="i" :="item" :slots="slots" />
    </template>
    <template v-if="typeOf(children) === 'undefined' && isShowDefaultSlot(slot, $attrs.type || $attrs.label)" #default="{ row, column, $index }">
      <component v-if="!!slot" :is="slots[slot]" :="{ row, column, $index }" />
      <template v-else>{{ rowKey(prop, row, column, $index, formatter) }}</template>
    </template>
    <template v-if="!!header" #header="scope">
      <component :is="slots[header]" :="scope" />
    </template>
  </el-table-column>
</template>

<script setup>
  import { typeOf } from "@/utils/method.js";
  const props = defineProps({
    // 嵌套的tableColumn
    children: {
      type: Array,
    },
    // el-table-column自定义头部插槽名字
    header: {
      type: [String],
      default: "",
    },
    // 所有的插槽集合
    slots: {
      type: Object,
      default: {},
    },
    // 要显示的字段key
    prop: {
      type: [String, Function],
      default: "",
    },
    // 格式化内容函数
    formatter: {
      type: Function,
    },
    // el-table-column自定义默认插槽名字
    slot: {
      type: String,
      default: "",
    },
    // 表格默认对齐方式
    align: {
      type: String,
      default: "center",
    },
  });

  function tableColumnProp(attrs) {
    const obj = { ...attrs };
    if (typeOf(props.prop) === "string") obj.prop = props.prop;
    obj.align = props.align;
    return obj;
  }

  function rowKey(key, row, column, $index, formatter) {
    if (!key) return "";
    if (typeOf(formatter) === "function") return formatter({ row, column, $index });
    if (typeOf(key) === "function") return key({ row, column, $index });
    const keys = key.split("."); // 'user[0].name'
    let value = "";
    keys.forEach((item) => {
      if (item.endsWith("]")) {
        const arr = item.split("[");
        const i = arr[1].split("]")[0];
        value = value ? value[arr[0]][i] : row[arr[0]][i];
      } else {
        value = value ? value[item] : row[item];
      }
    });
    return value;
  }

  function isShowDefaultSlot(slotName, type) {
    let bol = true;
    bol = !(["selection", "index", "expand", "编辑", "操作"].includes(type) && !slotName);
    return bol;
  }
</script>

<style lang="scss" scoped></style>
