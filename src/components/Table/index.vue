<template>
  <div>
    <el-table :="$attrs" ref="elTableRef" border>
      <table-column v-for="(item, i) in columns" :key="i" :="item" :slots="tableSlot($slots, false)" />
      <template v-for="(val, key) in tableSlot($slots)" #[key]="scope">
        <component :is="val" :="scope" />
      </template>
    </el-table>
    <div class="flex_row_center footer">
      <slot v-if="$slots.default" />
      <div v-else></div>
      <el-pagination
        size="small"
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
  });

  function tableSlot(s, isTabel = true) {
    let obj = {};
    if (isTabel) {
      if (s.append) obj.append = s.append;
      if (s.empty) obj.empty = s.empty;
    } else {
      for (let key in s) {
        if (!["append", "empty", "default"].includes(key)) obj[key] = s[key];
      }
    }
    return obj;
  }

  const elTableRef = useTemplateRef("elTableRef");

  defineExpose(
    new Proxy(
      {},
      {
        get(target, key) {
          return elTableRef.value?.[key];
        },
        has(target, key) {
          return key in elTableRef.value;
        },
      },
    ),
  );
</script>

<style lang="scss" scoped>
  .footer {
    margin-top: 10px;
    justify-content: space-between;
  }
</style>
