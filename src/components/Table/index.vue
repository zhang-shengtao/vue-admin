<template>
  <div style="overflow: hidden">
    <el-table :="$attrs" ref="elTableRef" border>
      <table-column v-for="(item, i) in columns" :key="i" :="item" :slots="tableSlot($slots, false)" />
      <template v-for="(val, key) in tableSlot($slots)" #[key]="scope">
        <component :is="val" :="scope" />
      </template>
    </el-table>
    <div style="margin-top: 15px">
      <el-dropdown placement="top" v-if="isAction">
        <el-button type="primary" text>批量操作</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(item, i) in action" :key="item" @click="() => $emit('changeAction', item, i)">
              {{ item }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-pagination
        style="float: right"
        small
        :page-sizes="[10, 20, 30, 40]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @change="(page, limit) => $emit('pageLimit', { page, limit })"
      />
    </div>
  </div>
</template>

<script setup>
import tableColumn from "./tableColumn.vue";
const props = defineProps({
  columns: {
    type: Array,
    require: true,
    default: [],
  },
  total: {
    type: Number,
    default: 0,
  },
  isAction: {
    type: Boolean,
    default: false,
  },
  action: {
    type: Array,
    default: ["批量删除", "批量编辑", "批量审核"],
  },
});

function tableSlot(s, isTabel = true) {
  let obj = {};
  if (isTabel) {
    if (s.append) obj.append = s.append;
    if (s.empty) obj.empty = s.empty;
  } else {
    for (let key in s) {
      if (!["append", "empty"].includes(key)) obj[key] = s[key];
    }
  }
  return obj;
}

const elTableRef = ref(null);

const proxy = new Proxy(
  {},
  {
    get(target, key) {
      return elTableRef.value?.[key];
    },
    has(target, key) {
      return key in elTableRef.value;
    },
  },
);

defineExpose(proxy);
</script>

<style lang="scss" scoped></style>
