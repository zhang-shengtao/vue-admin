<template>
  <el-card class="box-card">
    <my-table :data="tableData" @selection-change="action" :total="total" ref="MyTabels" @pageLimit="handlePagination" :columns="columns">
      <template #input="{ column, $index }">
        <el-input v-model="text" placeholder="请输入zip"></el-input>
      </template>

      <template #edit="{ row, column, $index }">
        <el-tag>Tag{{ $index }}</el-tag>
      </template>
      <template #image="{ row, column, $index }">
        <img :src="url" v-preview width="50" height="50" alt="" srcset="" />
      </template>
      <template #expand="{ row, column, $index }">
        <div>展开行内容{{ row.state }}</div>
      </template>
      <template #empty>
        <div>空的数据</div>
      </template>
      <el-button @click="clearSelection">左侧的</el-button>
    </my-table>
  </el-card>
</template>

<script setup>
  // const props = defineProps(["test"]); // 通过路由传参
  // console.log(props.test);

  const total = ref(30);
  const url = "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg";
  const tableData = [
    {
      date: "2016-05-03",
      name: "测试的",
      age: 11,
      url,
      state: "10",
      address: "No. 189, Grove St, Los Angeles",
      zip: "CA 90036",
    },
    {
      date: "2016-05-02",
      name: "哈哈哈哈",
      age: 13,
      url,
      address: "No. 189, Grove St, Los Angeles",
      state: "5",
      zip: "CA 90036",
    },
    {
      date: "2016-05-04",
      name: "哈哈哈哈",
      age: 12,
      url,
      address: "No. 189, Grove St, Los Angeles",
      state: "7",
      zip: "CA 90036",
    },
    {
      date: "2016-05-01",
      name: "哈哈哈哈",
      age: 9,
      url,
      address: "No. 189, Grove St, Los Angeles",
      state: "2",
      zip: "CA 90036",
    },
  ];

  const text = ref("");

  const columns = [
    {
      type: "selection",
      width: "120",
      fixed: true,
    },
    {
      label: "时间1",
      prop: "date",
      sortable: true,
      width: "300",
    },
    {
      label: "整体",
      children: [
        {
          label: "姓名",
          prop: "name",
          width: "300",
        },
        {
          label: "地址信息",
          children: [
            {
              label: "年龄",
              prop: ({ row }) => row.age,
              width: "300",
              "column-key": "age",
              filters: [
                { text: "11岁", value: 11 },
                { text: "12岁", value: 12 },
                { text: "13岁", value: 13 },
              ],
              "filter-method": (value, row) => row.age === value,
            },
            {
              label: "地址",
              prop: "address",
              width: "300",
            },
            {
              label: "state1111",
              prop: "state",
              width: "300",
            },
            {
              label: "图片",
              prop: "url",
              width: "300",
              slot: "image",
            },
            {
              label: "zpiyayya",
              prop: "zip",
              width: "300",
              header: "input",
            },
          ],
        },
      ],
    },
    {
      label: "编辑",
      fixed: "right",
      slot: "edit",
      width: "100",
    },
  ];

  // const tabelHeaders = [
  //   {
  //     type: "selection",
  //     width: "120",
  //     fixed: true,
  //   },
  //   {
  //     label: "时间",
  //     prop: "date",
  //     sortable: true,
  //     width: "300",
  //   },
  //   {
  //     label: "姓名",
  //     prop: "name",
  //     width: "300",
  //   },
  //   {
  //     label: "state1111",
  //     prop: "state",
  //     width: "300",
  //     sortable: true,
  //   },
  //   {
  //     label: "年龄",
  //     prop: "age",
  //     width: "300",
  //     "column-key": "age",
  //     filters: [
  //       { text: "11岁", value: 11 },
  //       { text: "12岁", value: 12 },
  //       { text: "13岁", value: 13 },
  //     ],
  //     "filter-method": (value, row) => row.age === value,
  //   },
  //   {
  //     label: "地址",
  //     prop: "address",
  //     width: "300",
  //   },
  //   {
  //     label: "zpiyayya",
  //     prop: "zip",
  //     header: "input",
  //     width: "300",
  //   },
  //   {
  //     label: "图片",
  //     prop: "url",
  //     width: "300",
  //     slot: "image",
  //   },
  //   {
  //     label: "编辑",
  //     fixed: "right",
  //     slot: "edit",
  //     width: "100",
  //   },
  //   {
  //     type: "expand",
  //     slot: "expand",
  //     label: ">",
  //   },
  // ];

  const MyTabels = useTemplateRef("MyTabels");
  function clearSelection() {
    MyTabels.value.clearSelection();
  }

  function action(val, a) {
    console.log(val, a);
  }

  function handlePagination(val) {
    console.log(val);
  }
  onMounted(() => {
    console.log("onMounted");
  });
  onBeforeMount(() => {
    console.log("onBeforeMount");
  });
</script>

<style lang="scss" scoped>
  .home {
    width: 100%;
    height: 100%;
  }
</style>
